"use client";

import { Link2, MessageCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { saveSettings } from "@/app/admin/(dashboard)/settings/actions";
import { useToast } from "@/components/admin/toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { idleActionResult } from "@/types/actions";
import type { SiteSettings } from "@/types/database";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveSettings, idleActionResult);
  const { show } = useToast();

  useEffect(() => {
    if (!state.message) return;
    show(state.message, state.ok ? "success" : "error");
  }, [state, show]);

  return (
    <form action={formAction} className="space-y-5">
      <section className="nova-panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-sage text-success">
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">Contact and ordering</h2>
            <p className="mt-0.5 text-xs text-muted">
              Details shown across the storefront and order messages.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            label="WhatsApp number"
            htmlFor="whatsapp_number"
            hint="We save it as 88016XXXXXXXX for WhatsApp links."
          >
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              defaultValue={settings.whatsapp_number}
              required
              placeholder="+88016XXXXXXXX or 016XXXXXXXX"
            />
          </Field>
          <Field label="Contact email (optional)" htmlFor="contact_email">
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={settings.contact_email}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Announcement bar (optional)" htmlFor="announcement_text">
              <Input
                id="announcement_text"
                name="announcement_text"
                maxLength={300}
                defaultValue={settings.announcement_text}
                placeholder="Order on WhatsApp — final price confirmed before payment"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="nova-panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-control bg-lilac text-primary">
            <Link2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">Social links</h2>
            <p className="mt-0.5 text-xs text-muted">Leave blank to hide a link.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Facebook URL" htmlFor="facebook_url">
            <Input
              id="facebook_url"
              name="facebook_url"
              type="url"
              defaultValue={settings.facebook_url}
              placeholder="https://facebook.com/..."
            />
          </Field>
          <Field label="Instagram URL" htmlFor="instagram_url">
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={settings.instagram_url}
              placeholder="https://instagram.com/..."
            />
          </Field>
        </div>
      </section>

      <Button type="submit" size="lg" pill className="min-w-44">
        Save settings
      </Button>
    </form>
  );
}
