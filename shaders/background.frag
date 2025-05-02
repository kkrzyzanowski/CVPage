#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Glow krzywa (Gaussian-like)
float glow(float d, float radius, float intensity) {
    return intensity * exp(-pow(d, 2.0) / radius);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec3 color = vec3(0.0);

    // ile linii światła
    const int COUNT = 20;

    for (int i = 0; i < COUNT; i++) {
        float y = float(i) / float(COUNT); // poziom linii
        float speed = 0.3 + rand(vec2(float(i))) * 1.5;
        float offset = rand(vec2(i, 42.0)) * 10.0;

        float x = mod(u_time * speed + offset, 1.5) - 0.25; // pozycja pozioma światła

        float d = abs(uv.x - x);
        float glowAmount = glow(d, 0.01, 0.9); // mały rozmiar + intensywność

        // Dodajemy glow do konkretnej linii (y-pozycja)
        float line = smoothstep(0.005, 0.0, abs(uv.y - y));
        color += vec3(1.0, 0.6, 1.0) * glowAmount * line;
    }

    gl_FragColor = vec4(color, 1.0);
}
