
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
canvas.style.border = '2px solid #333';
canvas.style.margin = '20px';
document.body.appendChild(canvas);

const statsDiv = document.createElement('div');
statsDiv.style.fontFamily = 'Arial, sans-serif';
statsDiv.style.margin = '10px 20px';
statsDiv.style.padding = '10px';
statsDiv.style.backgroundColor = '#f5f5f5';
statsDiv.style.borderRadius = '5px';
document.body.appendChild(statsDiv);

const controlsDiv = document.createElement('div');
controlsDiv.style.margin = '10px 20px';
controlsDiv.style.padding = '10px';
controlsDiv.style.backgroundColor = '#f0f0f0';
controlsDiv.style.borderRadius = '5px';
document.body.appendChild(controlsDiv);

const title = document.createElement('h2');
title.textContent = 'WebGPU Particle System Performance Demo';
title.style.color = '#333';
title.style.marginBottom = '15px';
controlsDiv.appendChild(title);

const countLabel = document.createElement('label');
countLabel.textContent = 'Particle Count: ';
countLabel.style.marginRight = '10px';
controlsDiv.appendChild(countLabel);

const countSlider = document.createElement('input');
countSlider.type = 'range';
countSlider.min = '1000';
countSlider.max = '100000';
countSlider.value = '10000';
countSlider.step = '1000';
countSlider.style.width = '200px';
countSlider.style.marginRight = '10px';
controlsDiv.appendChild(countSlider);

const countValue = document.createElement('span');
countValue.textContent = '10,000';
countValue.style.fontWeight = 'bold';
controlsDiv.appendChild(countValue);

controlsDiv.appendChild(document.createElement('br'));
controlsDiv.appendChild(document.createElement('br'));

const webgpuBtn = document.createElement('button');
webgpuBtn.textContent = 'WebGPU Mode';
webgpuBtn.style.marginRight = '10px';
webgpuBtn.style.padding = '8px 15px';
webgpuBtn.style.backgroundColor = '#4CAF50';
webgpuBtn.style.color = 'white';
webgpuBtn.style.border = 'none';
webgpuBtn.style.borderRadius = '4px';
webgpuBtn.style.cursor = 'pointer';
controlsDiv.appendChild(webgpuBtn);

const canvas2dBtn = document.createElement('button');
canvas2dBtn.textContent = 'Canvas2D Mode';
canvas2dBtn.style.marginRight = '10px';
canvas2dBtn.style.padding = '8px 15px';
canvas2dBtn.style.backgroundColor = '#2196F3';
canvas2dBtn.style.color = 'white';
canvas2dBtn.style.border = 'none';
canvas2dBtn.style.borderRadius = '4px';
canvas2dBtn.style.cursor = 'pointer';
controlsDiv.appendChild(canvas2dBtn);

const resetBtn = document.createElement('button');
resetBtn.textContent = 'Reset';
resetBtn.style.padding = '8px 15px';
resetBtn.style.backgroundColor = '#f44336';
resetBtn.style.color = 'white';
resetBtn.style.border = 'none';
resetBtn.style.borderRadius = '4px';
resetBtn.style.cursor = 'pointer';
controlsDiv.appendChild(resetBtn);


let particleCount = 10000;
let particles = new Float32Array(particleCount * 2);
let velocities = new Float32Array(particleCount * 2);
let colors = new Float32Array(particleCount * 4);
let lastTime = 0;
let fps = 0;
let frameCount = 0;
let startTime = performance.now();
let renderMode = 'webgpu';
let device, context, pipeline, particleBuffer, colorBuffer;
let animationId;

function initParticles() {
    for (let i = 0; i < particleCount * 2; i += 2) {
        particles[i] = Math.random() * 2 - 1;     // x position (-1 to 1)
        particles[i + 1] = Math.random() * 2 - 1; // y position (-1 to 1)
        
        velocities[i] = (Math.random() - 0.5) * 0.02;     // x velocity
        velocities[i + 1] = (Math.random() - 0.5) * 0.02; // y velocity
        
        // Assign random colors (RGBA)
        const colorIndex = (i / 2) * 4;
        colors[colorIndex] = Math.random() * 0.5 + 0.5;     // R
        colors[colorIndex + 1] = Math.random() * 0.5 + 0.5; // G
        colors[colorIndex + 2] = Math.random() * 0.5 + 0.5; // B
        colors[colorIndex + 3] = 0.8;                       // A
    }
}

// Update particle positions
function updateParticles(deltaTime) {
    for (let i = 0; i < particleCount * 2; i += 2) {
        // Update position based on velocity
        particles[i] += velocities[i] * deltaTime;
        particles[i + 1] += velocities[i + 1] * deltaTime;
        
        // Bounce off edges
        if (particles[i] < -1 || particles[i] > 1) velocities[i] *= -1;
        if (particles[i + 1] < -1 || particles[i + 1] > 1) velocities[i + 1] *= -1;
        
        // Keep within bounds
        particles[i] = Math.max(-1, Math.min(1, particles[i]));
        particles[i + 1] = Math.max(-1, Math.min(1, particles[i + 1]));
    }
}

// Initialize WebGPU
async function initWebGPU() {
    if (!navigator.gpu) {
        statsDiv.innerHTML = 'WebGPU is not supported in this browser. Try Chrome 113+ or Edge 113+.';
        return false;
    }
    
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        statsDiv.innerHTML = 'Failed to get GPU adapter.';
        return false;
    }
    
    device = await adapter.requestDevice();
    
    context = canvas.getContext('webgpu');
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: format,
        alphaMode: 'premultiplied'
    });
    
    // Create GPU buffers
    particleBuffer = device.createBuffer({
        size: particles.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    
    colorBuffer = device.createBuffer({
        size: colors.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    
    // Create shader code
    const shaderCode = `
        struct VertexInput {
            @location(0) position: vec2<f32>,
            @location(1) color: vec4<f32>,
            @builtin(instance_index) instance: u32,
        };
        
        struct VertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
        };
        
        @vertex
        fn vertex_main(vertex: VertexInput) -> VertexOutput {
            var output: VertexOutput;
            output.position = vec4(vertex.position, 0.0, 1.0);
            output.color = vertex.color;
            return output;
        }
        
        @fragment
        fn fragment_main(fragment: VertexOutput) -> @location(0) vec4<f32> {
            return fragment.color;
        }
    `;
    
    // Create shader module
    const shaderModule = device.createShaderModule({
        code: shaderCode
    });
    
    // Create render pipeline
    pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: 2 * 4, // 2 floats * 4 bytes each
                    attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }]
                },
                {
                    arrayStride: 4 * 4, // 4 floats * 4 bytes each
                    attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x4' }]
                }
            ]
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format: format }]
        },
        primitive: {
            topology: 'point-list'
        }
    });
    
    // Initialize data on GPU
    device.queue.writeBuffer(particleBuffer, 0, particles);
    device.queue.writeBuffer(colorBuffer, 0, colors);
    
    return true;
}

// Render with WebGPU
function renderWebGPU(deltaTime) {
    if (!device) return;
    
    // Update particle positions on CPU
    updateParticles(deltaTime);
    
    // Write particle data to GPU buffer
    device.queue.writeBuffer(particleBuffer, 0, particles);
    
    // Create command encoder
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    
    // Begin render pass
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });
    
    // Set pipeline and draw
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, particleBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.draw(1, particleCount);
    renderPass.end();
    
    // Submit commands
    device.queue.submit([commandEncoder.finish()]);
}

// Render with Canvas2D
function renderCanvas2D(deltaTime) {
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(15, 32, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update particle positions
    updateParticles(deltaTime);
    
    // Draw particles
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 2;
    
    for (let i = 0; i < particleCount * 2; i += 2) {
        const x = centerX + particles[i] * scale;
        const y = centerY + particles[i + 1] * scale;
        
        const colorIndex = (i / 2) * 4;
        const r = Math.floor(colors[colorIndex] * 255);
        const g = Math.floor(colors[colorIndex + 1] * 255);
        const b = Math.floor(colors[colorIndex + 2] * 255);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animation frame
function animate(currentTime) {
    // Calculate delta time and FPS
    const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0.016;
    lastTime = currentTime;
    
    frameCount++;
    if (currentTime - startTime >= 1000) {
        fps = Math.round(frameCount * 1000 / (currentTime - startTime));
        frameCount = 0;
        startTime = currentTime;
        
        // Update stats
        statsDiv.innerHTML = `
            <strong>Particle Count:</strong> ${particleCount.toLocaleString()} | 
            <strong>FPS:</strong> ${fps} | 
            <strong>Render Mode:</strong> ${renderMode.toUpperCase()} |
            <strong>Performance:</strong> ${fps > 50 ? 'Excellent' : fps > 30 ? 'Good' : fps > 15 ? 'Fair' : 'Poor'}
        `;
    }
    
    // Render based on current mode
    if (renderMode === 'webgpu') {
        renderWebGPU(deltaTime);
    } else {
        renderCanvas2D(deltaTime);
    }
    
    animationId = requestAnimationFrame(animate);
}

// Start the application
async function startApp() {
    // Initialize particles
    initParticles();
    
    // Try to initialize WebGPU
    const webGPUSupported = await initWebGPU();
    if (!webGPUSupported) {
        renderMode = 'canvas2d';
        webgpuBtn.disabled = true;
        webgpuBtn.style.backgroundColor = '#ccc';
    }
    
    // Start animation
    animationId = requestAnimationFrame(animate);
}

// Event listeners
countSlider.addEventListener('input', function() {
    particleCount = parseInt(this.value);
    countValue.textContent = particleCount.toLocaleString();
    
    // Reinitialize particles with new count
    particles = new Float32Array(particleCount * 2);
    velocities = new Float32Array(particleCount * 2);
    colors = new Float32Array(particleCount * 4);
    initParticles();
    
    // Reinitialize WebGPU if needed
    if (renderMode === 'webgpu') {
        initWebGPU();
    }
});

webgpuBtn.addEventListener('click', function() {
    if (renderMode !== 'webgpu') {
        renderMode = 'webgpu';
        webgpuBtn.style.backgroundColor = '#4CAF50';
        canvas2dBtn.style.backgroundColor = '#2196F3';
    }
});

canvas2dBtn.addEventListener('click', function() {
    if (renderMode !== 'canvas2d') {
        renderMode = 'canvas2d';
        canvas2dBtn.style.backgroundColor = '#4CAF50';
        webgpuBtn.style.backgroundColor = '#2196F3';
    }
});

resetBtn.addEventListener('click', function() {
    // Reinitialize particles
    initParticles();
    
    // Reinitialize WebGPU if needed
    if (renderMode === 'webgpu') {
        initWebGPU();
    }
});

// Start the application when the page loads
window.addEventListener('load', startApp);