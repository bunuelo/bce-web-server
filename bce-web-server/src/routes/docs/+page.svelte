<script>
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
</script>

<svelte:head>
    <title>{bce_lang($user_language, "page_docs_title")}</title>
</svelte:head>

<h1>{bce_lang($user_language, "page_docs_title")}</h1>

<p>{bce_lang($user_language, "page_docs_description")}</p>
<p><a href="https://bce.center:8000/docs" target="_blank">{bce_lang($user_language, "page_docs_rest_api_link_description")}</a></p>

