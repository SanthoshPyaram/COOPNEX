/**
 * WebGL Detection & Performance Helpers
 * Following the 3d-web-experience skill best practices
 */

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function isWebGL2Available(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function getOptimalDevicePixelRatio(): number {
  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Skill recommendation: Cap DPR to 1 on mobile for consistent 60fps, max 2 on desktop
  if (isMobile) return 1;
  return typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
}

