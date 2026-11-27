varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform float uTime;
uniform float uIntensity;
uniform float uSize;
uniform float uPulse;
uniform float uDisplacement;

void main() {
  vUv = uv;
  vNormal = normal;

  float pulse = sin(uTime * 2.0 + position.y * 8.0) * 0.5 + 0.5;
  vec3 displaced = position + normal * (pulse + uPulse) * uDisplacement * uIntensity;
  vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec4 viewPosition = viewMatrix * worldPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * (120.0 / max(1.0, -viewPosition.z));
}
