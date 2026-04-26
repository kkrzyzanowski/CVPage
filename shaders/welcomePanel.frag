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
    
    float n = noise(st * 8.0 + u_time * 1.5);
    float n2 = noise(st * 15.0 - u_time * 0.8);
    
    // Combined noise for more interesting effect
    float combined = (n + n2) * 0.5;
    
    // Create animated dissolve pattern
    float dissolve = smoothstep(0.3, 0.7, combined + sin(u_time * 2.0) * 0.2);
    
    // Color based on noise intensity
    vec3 color = u_color * mix(vec3(0.0), vec3(1.0), dissolve);
    
    // Add some color variation
    color.r *= 1.2;
    color.b *= 1.1;
    
    gl_FragColor = vec4(color, dissolve * 0.8);
}