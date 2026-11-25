"use client";

import { useActionState, useEffect } from "react";
import { saveSettings } from "@/app/admin/(dashboard)/settings/actions";
import { useToast } from "@/components/admin/toast";
import { idleActionResult } from "@/types/actions";
import type { SiteSettings } from "@/types/database";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveSettings, idleActionResult);
  const { show } = useToast();

  useEffect(() => {
    if (!state.message) return;
    show(state.message, state.ok ? "success" : "error");
  }, [state, show]);

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-medium">Contact and ordering</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="whatsapp_number" className="text-sm font-medium">
              WhatsApp number
            </label>
            <input
              id="whatsapp_number"
              name="whatsapp_number"
              defaultValue={settings.whatsapp_number}
              required
              placeholder="+88016XXXXXXXX or 016XXXXXXXX"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-ink/50">
              We save it as 88016XXXXXXXX for WhatsApp links.
            </p>
          </div>
          <div>
            <label htmlFor="contact_email" className="text-sm font-medium">
              Contact email (optional)
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={settings.contact_email}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="announcement_text" className="text-sm font-medium">
              Announcement bar (optional)
            </label>
            <input
              id="announcement_text"
              name="announcement_text"
              maxLength={300}
              defaultValue={settings.announcement_text}
              placeholder="Order on WhatsApp — final price confirmed before payment"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-ink/10 bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-medium">Social links</h2>
        <p className="mt-1 text-sm text-ink/55">Leave blank to hide a link.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="facebook_url" className="text-sm font-medium">
              Facebook URL
            </label>
            <input
              id="facebook_url"
              name="facebook_url"
              type="url"
              defaultValue={settings.facebook_url}
              placeholder="https://facebook.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="instagram_url" className="text-sm font-medium">
              Instagram URL
            </label>
            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={settings.instagram_url}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="rounded-full border border-brand bg-brand px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Save settings
      </button>
    </form>
  );
}
