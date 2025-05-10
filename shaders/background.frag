precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float random(float val){
    return fract(sin(val * 91.3458 + 47.853) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.0);
    // Pozycja linii fali
    for(float i = 0.07; i<=0.35; i+=0.07){
        float y = i + 0.1 * sin(uv.x * random(i) * 10.0 + u_time * 0.5);

    // Odległość od aktualnego piksela do fali
    float dist = abs(uv.y - y);
	
    // Glow efekt wokół linii
    float glow = exp(-dist * 100.);
    float glowBackground = smoothstep(0.09, 0.0, dist);
    // Kolor neonowy, np. fiolet
    color += vec3(0.8, 0.2, 1.0) * (glow + glowBackground) ;
    }
    

    gl_FragColor = vec4(color, 1.0);
}
