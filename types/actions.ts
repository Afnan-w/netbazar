export type ActionResult = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

export const idleActionResult: ActionResult = { ok: false, message: "" };
