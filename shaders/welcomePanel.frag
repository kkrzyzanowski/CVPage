precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    float n = noise(st * 10.0 + u_time * 2.0);
    
    // Dissolve effect: use noise as mask
    float dissolve = step(0.5, n);
    
    vec3 color = vec3(0.0); // Background color
    if (dissolve > 0.0) {
        color = vec3(1.0); // Biały efekt dla lepszego blendu
    }
    
    gl_FragColor = vec4(color, dissolve * 0.8); // Przezroczysty biały efekt
}