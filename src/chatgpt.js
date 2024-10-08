async function chatgptAnswer() {
    const userQuestion = $searchText || $pasteboardContent || "Test message.";

    // const model = "gpt-4o";
    // const model = "gpt-3.5-turbo";
    // Go check more models: https://platform.openai.com/docs/models
    const model = "gpt-4o-mini";
    const url = "https://api.openai.com/v1/chat/completions";

    try {
        const { data } = await $http({
            url,
            method: "POST",
            header: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${$OPENAI_API_KEY}`,
            },
            body: {
                messages: [
                    {
                        role: "system",
                        content: ""
                    },
                    {
                        role: "user",
                        content: userQuestion
                    }
                ],
                model: model,
                temperature: 0
            },
            timeout: 30
        });
        if (data) {
            const { choices } = JSON.parse(data);
            if (choices && choices.length > 0) {
                let { message } = choices[0];
                return message && message.content;
            }
        }
        return "";
    } catch (error) {
        $log(error);
        return "";
    }
}

async function output() {
    const result = await chatgptAnswer();
    return result;
}
