<script>
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
</script>

<svelte:head>
    <title>{bce_lang($user_language, "page_contact_title")}</title>
</svelte:head>

<h1>{bce_lang($user_language, "page_contact_title")}</h1>
