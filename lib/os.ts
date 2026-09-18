import type { CpuArch, PlatformId } from './releases';

export function detectOs(): PlatformId | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macos';
  if (/Linux|X11/i.test(ua)) return 'linux';
  return 'unknown';
}

export async function detectMacArch(): Promise<CpuArch | 'unknown'> {
  if (typeof navigator === 'undefined') return 'unknown';
  if (detectOs() !== 'macos') return 'unknown';

  const uaData = (
    navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
      };
    }
  ).userAgentData;

  try {
    const entropy = await uaData?.getHighEntropyValues?.(['architecture']);
    const arch = entropy?.architecture?.toLowerCase();
    if (arch === 'arm' || arch === 'arm64' || arch === 'aarch64') return 'arm64';
    if (arch === 'x86' || arch === 'x64' || arch === 'x86_64' || arch === 'amd64') return 'x64';
  } catch {
    // Client Hints are optional; fall through to WebGL.
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '') : '';
      if (/Apple M\d|Apple GPU/i.test(renderer)) return 'arm64';
      if (/Intel|AMD|Radeon|NVIDIA|GeForce/i.test(renderer)) return 'x64';
    }
  } catch {
    // Privacy-restricted WebGL still leaves arch unknown.
  }

  return 'unknown';
}
