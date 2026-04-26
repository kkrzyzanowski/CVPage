// Ładujemy shadery z plików
async function loadShaderSource(url) {
    const response = await fetch(url);
    return await response.text();
}

// Tworzymy shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Tworzymy program
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

async function initializeWelcomePanel(canvas) {
    const welcomeGl = window.welcomeGl;
    const welcomePanelCanvas = document.getElementById('welcome-canvas');
    
    const vertexSource = await loadShaderSource('../shaders/welcomePanel.vert');
    const fragmentSource = await loadShaderSource('../shaders/welcomePanel.frag');

    const vertexShader = createShader(welcomeGl, welcomeGl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(welcomeGl, welcomeGl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(welcomeGl, vertexShader, fragmentShader);

    const positionAttributeLocation = welcomeGl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = welcomeGl.getUniformLocation(program, "u_resolution");
    const timeUniformLocation = welcomeGl.getUniformLocation(program, "u_time");
    const colorUniformLocation = welcomeGl.getUniformLocation(program, "u_color");

    const positionBuffer = welcomeGl.createBuffer();
    welcomeGl.bindBuffer(welcomeGl.ARRAY_BUFFER, positionBuffer);

    // Pobieramy kolor z div'a welcome-panel
    const welcomePanelDiv = document.querySelector('.welcome-panel');
    const bgColor = window.getComputedStyle(welcomePanelDiv).backgroundColor;
    const rgbMatch = bgColor.match(/\d+/g);
    const color = rgbMatch ? [
        parseInt(rgbMatch[0]) / 255,
        parseInt(rgbMatch[1]) / 255,
        parseInt(rgbMatch[2]) / 255
    ] : [0.7, 0.0, 1.0]; // fallback na blueviolet

    const positions = [
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ];
    welcomeGl.bufferData(welcomeGl.ARRAY_BUFFER, new Float32Array(positions), welcomeGl.STATIC_DRAW);

    function resizeCanvasToDisplaySize(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    function render(time) {
        time *= 0.001; // na sekundy

        resizeCanvasToDisplaySize(welcomePanelCanvas);
        welcomeGl.viewport(0, 0, welcomeGl.canvas.width, welcomeGl.canvas.height);

        welcomeGl.clearColor(0, 0, 0, 0);
        welcomeGl.clear(welcomeGl.COLOR_BUFFER_BIT);

        welcomeGl.useProgram(program);

        // Atrybuty
        welcomeGl.enableVertexAttribArray(positionAttributeLocation);
        welcomeGl.bindBuffer(welcomeGl.ARRAY_BUFFER, positionBuffer);
        welcomeGl.vertexAttribPointer(positionAttributeLocation, 2, welcomeGl.FLOAT, false, 0, 0);

        // Uniformy
        welcomeGl.uniform2f(resolutionUniformLocation, welcomeGl.canvas.width, welcomeGl.canvas.height);
        welcomeGl.uniform1f(timeUniformLocation, time);
        welcomeGl.uniform3f(colorUniformLocation, color[0], color[1], color[2]);

        welcomeGl.drawArrays(welcomeGl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

async function initializeBackground(canvas) {
    const vertexSource = await loadShaderSource('../shaders/background.vert');
    const fragmentSource = await loadShaderSource('../shaders/background.frag');

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const mouse = [0, 0];
    canvas.addEventListener('mousemove', e => {
        mouse[0] = e.clientX;
        mouse[1] = gl.canvas.height - e.clientY;
    });

    function resizeCanvasToDisplaySize(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
    }

    function render(time) {
        time *= 0.001; // na sekundy

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        // Atrybuty
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniformy
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(mouseUniformLocation, mouse[0], mouse[1]);
        gl.uniform1f(timeUniformLocation, time);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

// Główna funkcja inicjująca
async function main() {
    const canvas = document.getElementById('background');
    const welcomePanelCanvas = document.getElementById('welcome-canvas');
    
    if (!canvas || !welcomePanelCanvas) {
        console.error('Canvas elements not found');
        return;
    }
    
    window.gl = canvas.getContext('webgl');
    window.welcomeGl = welcomePanelCanvas.getContext('webgl');
    
    if (!window.gl || !window.welcomeGl) {
        console.error('WebGL context not supported');
        return;
    }
    
    await Promise.all([
        initializeBackground(canvas),
        initializeWelcomePanel(welcomePanelCanvas),
    ]);
}

// Czekamy na załadowanie DOM
document.addEventListener('DOMContentLoaded', main);
