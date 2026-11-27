varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform vec3 uColorTheme;
uniform float uIntensity;
uniform float uTime;

void main() {
  // Distance-based alpha for depth effect
  float distanceFactor = length(vWorldPosition) * 0.1;
  float alpha = vUv.y * 0.5 + 0.5; // Radial gradient
  alpha *= uIntensity;
  alpha *= smoothstep(0.0, 1.0, distanceFactor);

  // Color based on theme and intensity
  vec3 color = uColorTheme;
  float spark = sin(vWorldPosition.x * 10.0 + uTime * 2.0) *
                sin(vWorldPosition.y * 10.0 + uTime * 3.0) *
                sin(vWorldPosition.z * 10.0 + uTime * 1.5);
  spark = spark * 0.5 + 0.5;
  color = mix(color, vec3(1.0, 0.95, 0.76), spark * 0.3); // Hot white sparks

  gl_FragColor = vec4(color, alpha);
}