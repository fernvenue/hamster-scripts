async function googleTranslate(text) {
    try {
        const baseUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=auto&dt=t&q=${encodeURIComponent(text)}`;
        const originalResponse = await $http({
            url: baseUrl,
            header: {
                "Content-Type": "application/json"
            }
        });

        if (originalResponse.response.statusCode !== 200) {
            return "Error: Fail to get response from Google API.";
        }

        const jsonDictionary = JSON.parse(originalResponse.data);
        const detectedLanguage = jsonDictionary[2];
        let targetLanguage = detectedLanguage === "zh-CN" ? "en" : "zh-CN";
        const urlWithTarget = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

        const responseWithTarget = await $http({
            url: urlWithTarget,
            header: {
                "Content-Type": "application/json",
            }
        });

        if (responseWithTarget.response.statusCode !== 200) {
            return "Error: Fail to get response from Google API.";
        }

        const translatedText = JSON.parse(responseWithTarget.data)[0].map(item => item[0]).join('');
        return translatedText;

    } catch (error) {
        $log(error);
        return "Error: Unknown error.";
    }
}

async function output() {
    var text = $searchText || $pasteboardContent || "Hi?";
    if (!text) {
        return "Please enter the text you want to translate.";
    }

    const translatedText = await googleTranslate(text);
    return translatedText;
}
