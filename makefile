
SOURCE_FILES = \
  bce-web-server/vite.config.js \
  bce-web-server/src/lib/bce_inventory.js \
  bce-web-server/src/lib/bce_rest_api.js \
  bce-web-server/src/lib/bce_session.js \
  bce-web-server/src/lib/bce_stores.js \
  bce-web-server/src/routes/Edit.svelte \
  bce-web-server/src/routes/Logo.svelte \
  bce-web-server/src/routes/Menu.svelte \
  bce-web-server/src/routes/+page.svelte \
  bce-web-server/src/routes/+error.svelte \
  bce-web-server/src/routes/+layout.svelte \
  bce-web-server/src/routes/contact/+page.svelte \
  bce-web-server/src/routes/design/+page.svelte \
  bce-web-server/src/routes/design/Model.svelte \
  bce-web-server/src/routes/design/Design.svelte \
  bce-web-server/src/routes/docs/+page.svelte \
  bce-web-server/src/routes/inventory/+page.svelte \
  bce-web-server/src/routes/terms/+page.svelte \
  bce-web-server/src/routes/user/acls/+page.svelte \
  bce-web-server/src/routes/user/create-account/+page.svelte \
  bce-web-server/src/routes/user/login/+page.svelte \
  bce-web-server/src/routes/user/logout/+page.svelte \
  bce-web-server/src/routes/user/dashboard/+page.svelte \
  bce-web-server/src/routes/user/settings/+page.svelte \
  bce-web-server/src/routes/user/assets/+page.svelte \
  test \
  start \
  bootstrap \
  README.md \
  makefile


start-editor:
	emacs -nw $(SOURCE_FILES)
