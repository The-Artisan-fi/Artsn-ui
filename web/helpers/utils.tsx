export function formatString(text: string) {
    let outputText = text.replace(" ", "-");
    outputText = outputText.replace("_", "-");
    outputText = outputText.toLowerCase();

    return outputText;
}