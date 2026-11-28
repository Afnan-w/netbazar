-- Netbazar uses the owner's Gmail for general enquiries until a dedicated
-- mailbox exists. Replace the placeholder seed value on existing installs.
update public.site_settings
set
  contact_email = 'ox17afnan@gmail.com',
  announcement_text = 'Supplier checked first. We send the price, shipping and delivery time in your quote before you pay.',
  updated_at = now()
where id = 1
  and (
    coalesce(contact_email, '') = ''
    or contact_email like '%.example'
  );
