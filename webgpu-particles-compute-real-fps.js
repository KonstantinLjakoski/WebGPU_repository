

//КРЕИРАЊЕ НА КОРИСНИЧКИ ИНТЕРФЕЈС
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
document.body.style.background = 'linear-gradient(135deg, #0c0c2e, #1a1a3e, #2d2d5a)';
document.body.style.color = '#ffffff';
document.body.style.minHeight = '100vh';
document.body.style.overflowX = 'hidden';

//glaven kontenjer
const container = document.createElement('div');
container.style.maxWidth = '1200px';
container.style.margin = '0 auto';
container.style.padding = '20px';
document.body.appendChild(container);


const header = document.createElement('header');
header.style.textAlign = 'center';
header.style.padding = '30px 0';
header.style.marginBottom = '30px';
header.style.background = 'linear-gradient(90deg, rgba(76, 0, 255, 0.2), rgba(148, 0, 255, 0.2))';
header.style.borderRadius = '15px';
header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
header.innerHTML = `
    <h1 style="font-size: 2.8rem; margin-bottom: 10px; background: linear-gradient(90deg, #ff00cc, #3333ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);">
        WebGPU Particle System
    </h1>
    <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 15px;">
        Споредба на Compute Shader vs Render Shader перформанси
    </p>
    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
        <span style="background: rgba(0, 255, 0, 0.2); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
            🚀 Compute Shader
        </span>
        <span style="background: rgba(255, 165, 0, 0.2); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
            ⚡ Render Shader
        </span>
        <span style="background: rgba(0, 0, 255, 0.2); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
            📊 FPS Споредба
        </span>
    </div>
`;
container.appendChild(header);

//glavna sodrzina
const mainContent = document.createElement('div');
mainContent.style.display = 'grid';
mainContent.style.gridTemplateColumns = '1fr 350px';
mainContent.style.gap = '25px';
mainContent.style.marginBottom = '30px';
container.appendChild(mainContent);


const canvasContainer = document.createElement('div');
canvasContainer.style.position = 'relative';
canvasContainer.style.borderRadius = '12px';
canvasContainer.style.overflow = 'hidden';
canvasContainer.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
canvasContainer.style.background = '#000011';
mainContent.appendChild(canvasContainer);


const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
canvas.style.display = 'block';
canvas.style.width = '100%';
canvas.style.height = '500px';
canvasContainer.appendChild(canvas);

const canvasStatus = document.createElement('div');
canvasStatus.style.background = 'linear-gradient(90deg, rgba(76, 0, 255, 0.3), rgba(148, 0, 255, 0.3))';
canvasStatus.style.padding = '12px 20px';
canvasStatus.style.display = 'flex';
canvasStatus.style.justifyContent = 'space-between';
canvasStatus.style.alignItems = 'center';
canvasStatus.style.fontSize = '0.9rem';
canvasStatus.style.color = '#e0e0ff';
canvasContainer.appendChild(canvasStatus);

canvasStatus.innerHTML = `
    <div>
        <strong>Режим:</strong> 
        <span id="shader-mode" style="color: #00ff00;">Compute Shader</span>
    </div>
    <div>
        <strong>FPS:</strong> 
        <span id="fps-display" style="color: #ffff00;">0</span> | 
        <strong>Перформанси:</strong> 
        <span id="performance-status" style="color: #00ffff;">-</span>
    </div>
`;


const controlsPanel = document.createElement('div');
controlsPanel.style.background = 'rgba(20, 20, 40, 0.8)';
controlsPanel.style.padding = '25px';
controlsPanel.style.borderRadius = '12px';
controlsPanel.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
controlsPanel.style.backdropFilter = 'blur(10px)';
mainContent.appendChild(controlsPanel);


const metricsSection = document.createElement('div');
metricsSection.style.marginBottom = '25px';
metricsSection.innerHTML = `
    <h3 style="color: #ff00cc; margin-bottom: 15px; border-bottom: 2px solid rgba(255, 0, 204, 0.3); padding-bottom: 8px;">
        📊 МЕТРИКИ НА ПЕРФОРМАНСИ
    </h3>
`;
controlsPanel.appendChild(metricsSection);


const metricsGrid = document.createElement('div');
metricsGrid.style.display = 'grid';
metricsGrid.style.gridTemplateColumns = '1fr 1fr';
metricsGrid.style.gap = '12px';
metricsGrid.style.marginBottom = '20px';
metricsSection.appendChild(metricsGrid);

const metrics = [
    { id: 'particle-count', label: 'Број на партикли', value: '0', color: '#00ff00' },
    { id: 'shader-type', label: 'Тип на Shader', value: 'Compute', color: '#ff9900' },
    { id: 'compute-time', label: 'Compute Time', value: '0ms', color: '#00ffff' },
    { id: 'render-time', label: 'Render Time', value: '0ms', color: '#ff00cc' },
    { id: 'cpu-time', label: 'CPU Time', value: '0ms', color: '#9966ff' },
    { id: 'total-time', label: 'Total Time', value: '0ms', color: '#ffff00' }
];

metrics.forEach(metric => {
    const metricCard = document.createElement('div');
    metricCard.style.background = 'rgba(255, 255, 255, 0.05)';
    metricCard.style.padding = '12px';
    metricCard.style.borderRadius = '8px';
    metricCard.style.textAlign = 'center';
    metricCard.style.border = `1px solid ${metric.color}20`;
    
    metricCard.innerHTML = `
        <div style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 5px;">${metric.label}</div>
        <div id="${metric.id}" style="font-size: 1.1rem; font-weight: bold; color: ${metric.color};">${metric.value}</div>
    `;
    
    metricsGrid.appendChild(metricCard);
});


const fpsComparisonContainer = document.createElement('div');
fpsComparisonContainer.style.marginBottom = '20px';
fpsComparisonContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 0.9rem; opacity: 0.8;">FPS Споредба:</span>
        <span id="fps-comparison" style="font-size: 0.9rem; color: #ffff00;">Compute: 0 | Render: 0</span>
    </div>
    <canvas id="fps-comparison-graph" width="300" height="80" style="width: 100%; height: 80px; background: rgba(0, 0, 0, 0.3); border-radius: 4px;"></canvas>
    <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.7rem; opacity: 0.7;">
        <span>Compute</span>
        <span>Render</span>
    </div>
`;
metricsSection.appendChild(fpsComparisonContainer);


const controlsSection = document.createElement('div');
controlsSection.innerHTML = `
    <h3 style="color: #00ccff; margin-bottom: 15px; border-bottom: 2px solid rgba(0, 204, 255, 0.3); padding-bottom: 8px;">
        🎮 КОНТРОЛИ ЗА СПОРЕДБА
    </h3>
`;
controlsPanel.appendChild(controlsSection);


const sliders = [
    { id: 'particle-slider', label: 'Број на партикли', min: 1000, max: 50000, step: 1000, value: 5000 },
    { id: 'speed-slider', label: 'Брзина на симулација', min: 0.1, max: 3, step: 0.1, value: 1.0 }
];

sliders.forEach(slider => {
    const sliderContainer = document.createElement('div');
    sliderContainer.style.marginBottom = '20px';
    
    const label = document.createElement('label');
    label.textContent = slider.label;
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    label.style.color = '#e0e0ff';
    sliderContainer.appendChild(label);
    
    const valueDisplay = document.createElement('div');
    valueDisplay.id = `${slider.id}-value`;
    valueDisplay.style.float = 'right';
    valueDisplay.style.color = '#ffff00';
    valueDisplay.style.fontWeight = 'bold';
    label.appendChild(valueDisplay);
    
    const input = document.createElement('input');
    input.type = 'range';
    input.id = slider.id;
    input.min = slider.min;
    input.max = slider.max;
    input.step = slider.step;
    input.value = slider.value;
    input.style.width = '100%';
    input.style.height = '6px';
    input.style.borderRadius = '3px';
    input.style.background = 'rgba(255, 255, 255, 0.1)';
    input.style.outline = 'none';
    sliderContainer.appendChild(input);
    
    controlsSection.appendChild(sliderContainer);
});

const shaderModeButtons = document.createElement('div');
shaderModeButtons.style.display = 'flex';
shaderModeButtons.style.gap = '10px';
shaderModeButtons.style.marginBottom = '20px';
controlsSection.appendChild(shaderModeButtons);

const shaderModes = [
    { id: 'btn-compute', text: '🚀 Compute Shader', active: true },
    { id: 'btn-render', text: '⚡ Render Shader', active: false },
    { id: 'btn-auto-switch', text: '🔄 Авто Прекинувач', active: false }
];

shaderModes.forEach(mode => {
    const button = document.createElement('button');
    button.id = mode.id;
    button.textContent = mode.text;
    button.style.padding = '12px 8px';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.background = mode.active ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)';
    button.style.color = mode.active ? '#000' : '#fff';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    button.style.fontSize = '0.9rem';
    button.style.flex = '1';
    
    button.addEventListener('mouseover', () => {
        if (!mode.active) {
            button.style.background = 'rgba(255, 255, 255, 0.2)';
        }
    });
    
    button.addEventListener('mouseout', () => {
        if (!mode.active) {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    shaderModeButtons.appendChild(button);
});


const actionButtons = document.createElement('div');
actionButtons.style.display = 'grid';
actionButtons.style.gridTemplateColumns = '1fr 1fr';
actionButtons.style.gap = '10px';
controlsSection.appendChild(actionButtons);

const actions = [
    { id: 'btn-reset', text: '🔄 Ресетирај', color: '#ff4444' },
    { id: 'btn-benchmark', text: '📊 Benchmark', color: '#44ff44' },
    { id: 'btn-export', text: '💾 Експорт', color: '#4444ff' },
    { id: 'btn-info', text: 'ℹ️ Инфо', color: '#ffaa00' }
];

actions.forEach(action => {
    const button = document.createElement('button');
    button.id = action.id;
    button.textContent = action.text;
    button.style.padding = '12px 8px';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.background = action.color;
    button.style.color = '#fff';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    button.style.fontSize = '0.9rem';
    
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = `0 5px 15px ${action.color}40`;
    });
    
    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });
    
    actionButtons.appendChild(button);
});


const infoSection = document.createElement('div');
infoSection.style.background = 'rgba(20, 20, 40, 0.8)';
infoSection.style.padding = '25px';
infoSection.style.borderRadius = '12px';
infoSection.style.marginTop = '25px';
infoSection.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
container.appendChild(infoSection);

infoSection.innerHTML = `
    <h3 style="color: #ff00cc; margin-bottom: 15px; border-bottom: 2px solid rgba(255, 0, 204, 0.3); padding-bottom: 8px;">
        ℹ️ СПОРЕДБА НА SHADER ТИПОВИ
    </h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
            <h4 style="color: #4CAF50; margin-bottom: 10px;">🚀 Compute Shader</h4>
            <ul style="line-height: 1.6; opacity: 0.9; padding-left: 20px;">
                <li>GPU-базирани пресметки</li>
                <li>Масивна паралелизација</li>
                <li>Добри перформанси за големи податоци</li>
                <li>Помало оптоварување на CPU</li>
            </ul>
        </div>
        <div>
            <h4 style="color: #FFA500; margin-bottom: 10px;">⚡ Render Shader</h4>
            <ul style="line-height: 1.6; opacity: 0.9; padding-left: 20px;">
                <li>Специјализиран за рендерирање</li>
                <li>Оптимизиран за графички пајплајн</li>
                <li>Добри перформанси за визуелизација</li>
                <li>Поедноставна имплементација</li>
            </ul>
        </div>
    </div>
`;

//WEBGPU ИМПЛЕМЕНТАЦИЈА

//glavni promenlivi
let device, context, computePipeline, renderPipeline;
let particleBuffer, velocityBuffer, colorBuffer;
let simulationParamsBuffer;
let particleCount = 5000;
let simulationSpeed = 1.0;
let currentShaderMode = 'compute'; // 'compute' или 'render'
let autoSwitchEnabled = false;
let lastSwitchTime = 0;

//za fps
let lastTime = 0;
let frameCount = 0;
let startTime = performance.now();
let computeTime = 0;
let renderTime = 0;
let cpuTime = 0;

//fps istorija
let computeFpsHistory = [];
let renderFpsHistory = [];
const MAX_FPS_HISTORY = 30;


const comparisonGraph = document.getElementById('fps-comparison-graph');
const comparisonCtx = comparisonGraph.getContext('2d');


async function initWebGPU() {
    try {
        if (!navigator.gpu) {
            throw new Error('WebGPU не е поддржан во овој прелистувач. Користете Chrome 113+ или Edge 113+.');
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('Не успеа да се земе GPU adapter');
        }

        device = await adapter.requestDevice();
        context = canvas.getContext('webgpu');
        const format = navigator.gpu.getPreferredCanvasFormat();
        
        context.configure({
            device: device,
            format: format,
            alphaMode: 'premultiplied'
        });

        createBuffers();
        await createComputePipeline();
        await createRenderPipeline(format);
        initializeParticles();

        document.getElementById('shader-mode').textContent = 'Compute Shader';
        return true;

    } catch (error) {
        console.error('Грешка при иницијализација:', error);
        document.getElementById('shader-mode').textContent = 'Грешка: ' + error.message;
        document.getElementById('shader-mode').style.color = '#ff0000';
        return false;
    }
}


function createBuffers() {
    particleBuffer = device.createBuffer({
        size: particleCount * 2 * 4,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    velocityBuffer = device.createBuffer({
        size: particleCount * 2 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    colorBuffer = device.createBuffer({
        size: particleCount * 4 * 4,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    simulationParamsBuffer = device.createBuffer({
        size: 3 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
}


async function createComputePipeline() {
    const computeShaderCode = `
        struct Particle {
            position: vec2<f32>,
            velocity: vec2<f32>
        };

        struct Params {
            deltaTime: f32,
            speed: f32,
            particleCount: f32
        };

        @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
        @group(0) @binding(1) var<uniform> params: Params;

        @compute @workgroup_size(64)
        fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
            let index = global_id.x;
            if (index >= u32(params.particleCount)) { return; }

            var particle = particles[index];
            let movement = particle.velocity * params.deltaTime * params.speed;
            particle.position += movement;

            // Едноставна физика - рефлектирање од ѕидовите
            if (abs(particle.position.x) > 0.95) {
                particle.velocity.x = -particle.velocity.x * 0.95;
                particle.position.x = clamp(particle.position.x, -0.95, 0.95);
            }
            if (abs(particle.position.y) > 0.95) {
                particle.velocity.y = -particle.velocity.y * 0.95;
                particle.position.y = clamp(particle.position.y, -0.95, 0.95);
            }

            particles[index] = particle;
        }
    `;

    const computeShader = device.createShaderModule({ code: computeShaderCode });
    computePipeline = device.createComputePipeline({
        layout: 'auto',
        compute: { module: computeShader, entryPoint: 'main' }
    });
}

//render pipeline
async function createRenderPipeline(format) {
    const renderShaderCode = `
        struct VertexInput {
            @location(0) position: vec2<f32>,
            @location(1) color: vec4<f32>
        };

        struct VertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>
        };

        @vertex
        fn vertexMain(input: VertexInput) -> VertexOutput {
            var output: VertexOutput;
            output.position = vec4<f32>(input.position, 0.0, 1.0);
            output.color = input.color;
            return output;
        }

        @fragment
        fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
            return input.color;
        }
    `;

    const renderShader = device.createShaderModule({ code: renderShaderCode });
    renderPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: renderShader,
            entryPoint: 'vertexMain',
            buffers: [
                {
                    arrayStride: 2 * 4,
                    attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }]
                },
                {
                    arrayStride: 4 * 4,
                    attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x4' }]
                }
            ]
        },
        fragment: {
            module: renderShader,
            entryPoint: 'fragmentMain',
            targets: [{ format: format }]
        },
        primitive: { topology: 'point-list' }
    });
}

//inicijalizacija na partikli
function initializeParticles() {
    const positions = new Float32Array(particleCount * 2);
    const velocities = new Float32Array(particleCount * 2);
    const colors = new Float32Array(particleCount * 4);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 2] = (Math.random() - 0.5) * 1.8;
        positions[i * 2 + 1] = (Math.random() - 0.5) * 1.8;
        
        velocities[i * 2] = (Math.random() - 0.5) * 0.02;
        velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.02;
        
        const hue = (i / particleCount) * 360;
        colors[i * 4] = (Math.sin(hue * 0.01745) * 0.5 + 0.5);
        colors[i * 4 + 1] = (Math.sin((hue + 120) * 0.01745) * 0.5 + 0.5);
        colors[i * 4 + 2] = (Math.sin((hue + 240) * 0.01745) * 0.5 + 0.5);
        colors[i * 4 + 3] = 0.8;
    }

    device.queue.writeBuffer(particleBuffer, 0, positions);
    device.queue.writeBuffer(velocityBuffer, 0, velocities);
    device.queue.writeBuffer(colorBuffer, 0, colors);
}

//cpu simulacija
function simulateParticlesCPU(deltaTime) {
    const cpuStart = performance.now();
    
    const positions = new Float32Array(particleCount * 2);
    const velocities = new Float32Array(particleCount * 2);
    
   
    const positionData = new Float32Array(particleBuffer.size / 4);
    const velocityData = new Float32Array(velocityBuffer.size / 4);
    
    
    for (let i = 0; i < particleCount * 2; i += 2) {
        const velX = (Math.random() - 0.5) * 0.02;
        const velY = (Math.random() - 0.5) * 0.02;
        
        positions[i] += velX * deltaTime * simulationSpeed;
        positions[i + 1] += velY * deltaTime * simulationSpeed;
        
        if (Math.abs(positions[i]) > 0.95) positions[i] *= -0.95;
        if (Math.abs(positions[i + 1]) > 0.95) positions[i + 1] *= -0.95;
    }
    
    cpuTime = performance.now() - cpuStart;
}


function animate(currentTime) {
    requestAnimationFrame(animate);

    const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0.016;
    lastTime = currentTime;

    
    if (autoSwitchEnabled && currentTime - lastSwitchTime > 5000) {
        toggleShaderMode();
        lastSwitchTime = currentTime;
    }

   
    const params = new Float32Array([deltaTime, simulationSpeed, particleCount]);
    device.queue.writeBuffer(simulationParamsBuffer, 0, params);

    let frameStart = performance.now();

    if (currentShaderMode === 'compute') {
       
        const computeStart = performance.now();
        runComputePass();
        computeTime = performance.now() - computeStart;
        renderTime = 0;
    } else {
    
        const renderStart = performance.now();
        simulateParticlesCPU(deltaTime);
        renderTime = performance.now() - renderStart;
        computeTime = 0;
    }

    
    const renderStart = performance.now();
    runRenderPass();
    const renderDuration = performance.now() - renderStart;

   
    updateMetrics(currentTime, deltaTime);
    updateComparisonGraph();
}


function runComputePass() {
    const commandEncoder = device.createCommandEncoder();
    
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: particleBuffer } },
            { binding: 1, resource: { buffer: simulationParamsBuffer } }
        ]
    }));
    
    computePass.dispatchWorkgroups(Math.ceil(particleCount / 64));
    computePass.end();
    
    device.queue.submit([commandEncoder.finish()]);
}


function runRenderPass() {
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.05, g: 0.05, b: 0.1, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });

    renderPass.setPipeline(renderPipeline);
    renderPass.setVertexBuffer(0, particleBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.draw(particleCount);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}


function updateMetrics(currentTime, deltaTime) {
    frameCount++;
    if (currentTime - startTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - startTime));
        
        if (currentShaderMode === 'compute') {
            computeFpsHistory.push(fps);
            if (computeFpsHistory.length > MAX_FPS_HISTORY) computeFpsHistory.shift();
        } else {
            renderFpsHistory.push(fps);
            if (renderFpsHistory.length > MAX_FPS_HISTORY) renderFpsHistory.shift();
        }
        
        document.getElementById('fps-display').textContent = fps;
        
        let performanceStatus = 'Одлично';
        let performanceColor = '#00ff00';
        if (fps < 50) { performanceStatus = 'Добро'; performanceColor = '#ffff00'; }
        if (fps < 30) { performanceStatus = 'Прифатливо'; performanceColor = '#ff9900'; }
        if (fps < 15) { performanceStatus = 'Лошо'; performanceColor = '#ff0000'; }
        
        document.getElementById('performance-status').textContent = performanceStatus;
        document.getElementById('performance-status').style.color = performanceColor;
        
        frameCount = 0;
        startTime = currentTime;
    }

    document.getElementById('particle-count').textContent = particleCount.toLocaleString();
    document.getElementById('shader-type').textContent = currentShaderMode === 'compute' ? 'Compute' : 'Render';
    document.getElementById('compute-time').textContent = computeTime.toFixed(2) + 'ms';
    document.getElementById('render-time').textContent = renderTime.toFixed(2) + 'ms';
    document.getElementById('cpu-time').textContent = cpuTime.toFixed(2) + 'ms';
    document.getElementById('total-time').textContent = (computeTime + renderTime + cpuTime).toFixed(2) + 'ms';
}

function updateComparisonGraph() {
    const width = comparisonGraph.width;
    const height = comparisonGraph.height;
    
    comparisonCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    comparisonCtx.fillRect(0, 0, width, height);
    
    if (computeFpsHistory.length > 1) {
        comparisonCtx.beginPath();
        comparisonCtx.strokeStyle = '#4CAF50';
        comparisonCtx.lineWidth = 2;
        
        computeFpsHistory.forEach((fps, index) => {
            const x = (index / (MAX_FPS_HISTORY - 1)) * width;
            const y = height - (fps / 120) * height;
            if (index === 0) comparisonCtx.moveTo(x, y);
            else comparisonCtx.lineTo(x, y);
        });
        comparisonCtx.stroke();
    }
    
    if (renderFpsHistory.length > 1) {
        comparisonCtx.beginPath();
        comparisonCtx.strokeStyle = '#FFA500';
        comparisonCtx.lineWidth = 2;
        
        renderFpsHistory.forEach((fps, index) => {
            const x = (index / (MAX_FPS_HISTORY - 1)) * width;
            const y = height - (fps / 120) * height;
            if (index === 0) comparisonCtx.moveTo(x, y);
            else comparisonCtx.lineTo(x, y);
        });
        comparisonCtx.stroke();
    }
    
    const avgComputeFps = computeFpsHistory.length > 0 ? 
        Math.round(computeFpsHistory.reduce((a, b) => a + b) / computeFpsHistory.length) : 0;
    const avgRenderFps = renderFpsHistory.length > 0 ? 
        Math.round(renderFpsHistory.reduce((a, b) => a + b) / renderFpsHistory.length) : 0;
    
    document.getElementById('fps-comparison').textContent = 
        `Compute: ${avgComputeFps} | Render: ${avgRenderFps}`;
}

function toggleShaderMode() {
    currentShaderMode = currentShaderMode === 'compute' ? 'render' : 'compute';
    
    document.getElementById('shader-mode').textContent = 
        currentShaderMode === 'compute' ? 'Compute Shader' : 'Render Shader';
    document.getElementById('shader-mode').style.color = 
        currentShaderMode === 'compute' ? '#4CAF50' : '#FFA500';
    
    document.getElementById('btn-compute').style.background = 
        currentShaderMode === 'compute' ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)';
    document.getElementById('btn-compute').style.color = 
        currentShaderMode === 'compute' ? '#000' : '#fff';
    
    document.getElementById('btn-render').style.background = 
        currentShaderMode === 'render' ? '#FFA500' : 'rgba(255, 255, 255, 0.1)';
    document.getElementById('btn-render').style.color = 
        currentShaderMode === 'render' ? '#000' : '#fff';
}


document.getElementById('particle-slider').addEventListener('input', function(e) {
    particleCount = parseInt(e.target.value);
    document.getElementById('particle-slider-value').textContent = particleCount.toLocaleString();
    if (device) { createBuffers(); initializeParticles(); }
});

document.getElementById('speed-slider').addEventListener('input', function(e) {
    simulationSpeed = parseFloat(e.target.value);
    document.getElementById('speed-slider-value').textContent = simulationSpeed.toFixed(1);
});

document.getElementById('btn-compute').addEventListener('click', function() {
    autoSwitchEnabled = false;
    document.getElementById('btn-auto-switch').style.background = 'rgba(255, 255, 255, 0.1)';
    document.getElementById('btn-auto-switch').style.color = '#fff';
    currentShaderMode = 'compute';
    toggleShaderMode();
});

document.getElementById('btn-render').addEventListener('click', function() {
    autoSwitchEnabled = false;
    document.getElementById('btn-auto-switch').style.background = 'rgba(255, 255, 255, 0.1)';
    document.getElementById('btn-auto-switch').style.color = '#fff';
    currentShaderMode = 'render';
    toggleShaderMode();
});

document.getElementById('btn-auto-switch').addEventListener('click', function() {
    autoSwitchEnabled = !autoSwitchEnabled;
    this.style.background = autoSwitchEnabled ? '#2196F3' : 'rgba(255, 255, 255, 0.1)';
    this.style.color = autoSwitchEnabled ? '#000' : '#fff';
    this.textContent = autoSwitchEnabled ? '🔄 Авто: On' : '🔄 Авто: Off';
});

document.getElementById('btn-reset').addEventListener('click', function() {
    initializeParticles();
    computeFpsHistory = [];
    renderFpsHistory = [];
});

document.getElementById('btn-benchmark').addEventListener('click', function() {
    const avgCompute = computeFpsHistory.length > 0 ? 
        Math.round(computeFpsHistory.reduce((a, b) => a + b) / computeFpsHistory.length) : 0;
    const avgRender = renderFpsHistory.length > 0 ? 
        Math.round(renderFpsHistory.reduce((a, b) => a + b) / renderFpsHistory.length) : 0;
    
    alert(`Benchmark Results:
    
Compute Shader:
- Average FPS: ${avgCompute}
- Compute Time: ${computeTime.toFixed(2)}ms
- Best for: Large particle systems

Render Shader:
- Average FPS: ${avgRender}  
- Render Time: ${renderTime.toFixed(2)}ms
- Best for: Simple visualization

Performance Difference: ${Math.abs(avgCompute - avgRender)} FPS
Recommended: ${avgCompute > avgRender ? 'Compute Shader' : 'Render Shader'}`);
});

window.addEventListener('load', async function() {
    const success = await initWebGPU();
    if (success) {
        document.getElementById('particle-slider-value').textContent = particleCount.toLocaleString();
        document.getElementById('speed-slider-value').textContent = simulationSpeed.toFixed(1);
        
        requestAnimationFrame(function animateWrapper(timestamp) {
            animate(timestamp);
            requestAnimationFrame(animateWrapper);
        });
    }
});