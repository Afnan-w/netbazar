-- Set the live WhatsApp number for projects that already ran 0001_initial.sql.
-- Safe to run more than once.
update public.site_settings
set whatsapp_number = '8801627293330', updated_at = now()
where id = 1;
