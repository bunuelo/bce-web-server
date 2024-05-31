import { get } from 'svelte/store'
import { user_language } from './bce_stores.js'
import bce_language_dictionary from "./data/bce_language_dictionary.json";

export const get_system_default_language = function() {
    var navigator_language = "en";
    if (navigator.languages != undefined) {
        navigator_language = navigator.languages[0];
    } else {
        navigator_language = navigator.language;
    }
    console.log("navigator_language = \"" + navigator_language + "\"");
    return navigator_language;
}

function get_user_language() {
    if (get(user_language) == "") {
        let default_language = get_system_default_language();
        for (var supported_language in bce_language_dictionary) {
            if (default_language.startsWith(supported_language)) {
                return supported_language;
            }
        }
        return "en";
    }
    var search_language = get(user_language);
    for (var supported_language in bce_language_dictionary) {
        if (search_language.startsWith(supported_language)) {
            return supported_language;
        }
    }
    return "en";
}

export const bce_lang = function (language, key) {
    let user_language = get_user_language();
    console.log("user_language = \"" + user_language + "\"");
    let language_dictionary = bce_language_dictionary[user_language][key];
    return language_dictionary;
}

