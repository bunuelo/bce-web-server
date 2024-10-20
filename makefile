
SOURCE_FILES = \
    bce-web-server/vite.config.js \
    bce-web-server/static/global.css \
    bce-web-server/src/lib/data/bce_language_dictionary.json \
    bce-web-server/src/lib/bce_asset.js \
    bce-web-server/src/lib/bce_canvas_render.js \
    bce-web-server/src/lib/bce_inventory.js \
    bce-web-server/src/lib/bce_locale.js \
    bce-web-server/src/lib/bce_rest_api.js \
    bce-web-server/src/lib/bce_session.js \
    bce-web-server/src/lib/bce_stores.js \
    bce-web-server/src/lib/bce_time.js \
    bce-web-server/src/lib/AssetList.svelte \
    bce-web-server/src/lib/AssetSelector.svelte \
    bce-web-server/src/lib/stimrx/stimrx.js \
    bce-web-server/src/lib/stimrx/stimrx_editor.js \
    bce-web-server/src/lib/stimrx/StimrxExpressionEditor.svelte \
    bce-web-server/src/lib/stimrx/StimrxLightProjectionEditor.svelte \
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
    bce-web-server/src/routes/user/chats/+page.svelte \
    bce-web-server/src/routes/user/devices/+page.svelte \
    bce-web-server/src/routes/user/evaluations/+page.svelte \
    bce-web-server/src/routes/user/rxs/+page.svelte \
    test \
    start \
    bootstrap \
    start_bce_redirect_server \
    start_bce_web_server \
    bce-http-redirect-server/start \
    bce-http-redirect-server/bce_http_redirect.py \
    README.md \
    makefile


start-editor:
	emacs -nw $(SOURCE_FILES)
