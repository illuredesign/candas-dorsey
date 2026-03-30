export const vertexShader = /* glsl */ `
varying vec2 v_uv;
void main() {
  v_uv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  vec3 shift = vec3(100.0);
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float warpedNoise(vec2 uv, float t) {
  float slowT = t * 0.03;
  vec3 p = vec3(uv * 2.2, slowT * 0.4);
  float q1 = fbm(p + vec3(1.7, 9.2, 0.0));
  float q2 = fbm(p + vec3(8.3, 2.8, 0.0));
  vec3 r = vec3(
    uv.x * 2.2 + q1 * 1.6 + slowT * 0.15,
    uv.y * 2.2 + q2 * 1.6 + slowT * 0.12,
    slowT * 0.3
  );
  float result = fbm(r);
  vec3 s = vec3(
    uv.x * 3.0 + result * 0.8 + slowT * 0.08,
    uv.y * 3.0 + result * 0.6 - slowT * 0.1,
    slowT * 0.2 + 5.0
  );
  float detail = fbm(s);
  return (result + detail * 0.4) * 0.7;
}

vec3 paintingColor(float n, vec2 uv) {
  vec3 brightYellow = vec3(0.92, 0.75, 0.12);
  vec3 warmAmber    = vec3(0.85, 0.62, 0.10);
  vec3 deepGold     = vec3(0.77, 0.55, 0.15);
  vec3 burntSienna  = vec3(0.62, 0.32, 0.12);
  vec3 burgundy     = vec3(0.38, 0.08, 0.14);
  vec3 darkMaroon   = vec3(0.22, 0.05, 0.10);
  vec3 lightCream   = vec3(0.95, 0.85, 0.35);
  vec3 russet       = vec3(0.55, 0.20, 0.18);

  float vertBias = uv.y;
  float horizVar = snoise(vec3(uv.x * 3.0, uv.y * 0.5, u_time * 0.01)) * 0.15;
  vertBias += horizVar;

  float horizonLine = smoothstep(0.10, 0.25, vertBias);

  vec3 groundColor = mix(darkMaroon, burgundy, snoise(vec3(uv.x * 5.0, uv.y * 2.0, u_time * 0.02)) * 0.5 + 0.5);
  groundColor = mix(groundColor, russet, snoise(vec3(uv.x * 8.0, uv.y * 3.0, u_time * 0.015 + 3.0)) * 0.3 + 0.2);

  float skyN = n;
  vec3 skyColor;
  if (skyN < -0.2) {
    skyColor = mix(deepGold, burntSienna, smoothstep(-0.4, -0.2, skyN));
  } else if (skyN < 0.1) {
    skyColor = mix(warmAmber, brightYellow, smoothstep(-0.2, 0.1, skyN));
  } else if (skyN < 0.3) {
    skyColor = mix(brightYellow, lightCream, smoothstep(0.1, 0.3, skyN));
  } else {
    skyColor = mix(lightCream, brightYellow, smoothstep(0.3, 0.5, skyN));
  }

  float veinNoise = snoise(vec3(uv * 4.0, u_time * 0.02 + 10.0));
  float vein2 = snoise(vec3(uv.x * 6.0 + veinNoise * 0.8, uv.y * 3.0, u_time * 0.015));
  float veinMask = smoothstep(0.2, 0.45, abs(vein2)) * 0.6;
  skyColor = mix(skyColor, mix(burntSienna, russet, vein2 * 0.5 + 0.5), (1.0 - veinMask) * 0.4);

  float wispNoise = snoise(vec3(uv.x * 3.5 + u_time * 0.008, uv.y * 2.0, u_time * 0.025 + 20.0));
  float wispMask = smoothstep(0.3, 0.6, wispNoise) * 0.25;
  skyColor = mix(skyColor, russet, wispMask * (1.0 - vertBias * 0.3));

  vec3 color = mix(groundColor, skyColor, horizonLine);

  float bleedNoise = snoise(vec3(uv.x * 10.0, uv.y * 5.0, u_time * 0.01 + 7.0));
  float bleed = smoothstep(0.12, 0.22, vertBias + bleedNoise * 0.04);
  color = mix(groundColor, color, bleed);

  return color;
}

float canvasTexture(vec2 uv) {
  vec2 texUV = uv * u_resolution * 0.5;
  float horiz = sin(texUV.x * 3.14159) * 0.5 + 0.5;
  float vert = sin(texUV.y * 3.14159) * 0.5 + 0.5;
  float weave = horiz * vert;
  float grain = snoise(vec3(texUV * 0.3, 0.0)) * 0.5 + 0.5;
  return mix(0.92, 1.0, weave * 0.6 + grain * 0.4);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 scaledUV = vec2(uv.x * aspect, uv.y);

  float n = warpedNoise(scaledUV, u_time);
  vec3 color = paintingColor(n, uv);

  float tex = canvasTexture(uv);
  color *= tex;

  float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.2;
  color *= vig;

  color.r *= 1.04;
  color.b *= 0.92;

  gl_FragColor = vec4(color, 1.0);
}
`
