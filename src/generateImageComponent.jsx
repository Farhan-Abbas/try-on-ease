/* eslint-disable react/prop-types */

// Define the generateImage function in the global scope
async function generateImage(bodyImagePlaceholder, garmentImg) {
	const backendEndpoint = "https://try-on-ease-backend.vercel.app/api/imageGenerator";
    try {
        const response = await fetch(backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: [bodyImagePlaceholder, garmentImg] }),
        });
        const text = await response.text();
        const data = JSON.parse(text);
        if (response.ok) {
			console.log("Prediction request successful!");
            console.log(data["message"][0]);
            return ['success', data["message"][0]];
        } else {
			console.error("Prediction request failed!");
			console.error(data["message"]);
			return ['failure', data["message"]];
        }
    } catch (error) {
		console.error("Error sending data!", error);
		return ['failure', error];
    }

}

export function generateImageComponent(bodyImagePlaceholder, garmentImg) {
    let response = "";
    const handleGenerateImage = async () => {
		let generatedImgDiv = document.getElementsByClassName("generated-image-container")[0];
		generatedImgDiv.style.display = "none";
		let errorMsg = document.getElementsByClassName("error-msg")[0];
		errorMsg.innerHTML = "";
		errorMsg.style.display = "none";

		let loader = document.getElementsByClassName("loading-container")[0];

		loader.style.display = "flex";
		window.scrollTo(0, document.body.scrollHeight);

		response = await generateImage(bodyImagePlaceholder, garmentImg);
		// response = ["success", "https://www.w3schools.com/w3images/lights.jpg"];
		console.log("finished", response);

		loader.style.display = "none";

		if (response[0] === "success") {
			let resultImg = document.getElementById("resultImage");
			resultImg.src = response[1];
			generatedImgDiv.style.display = "block";
			window.scrollTo(0, document.body.scrollHeight);
		}
		else {
			errorMsg.style.display = "block";
			if (response[1]["message"]) {
				errorMsg.innerHTML = "Error: " + response[1]["message"];
			}
			else {
				errorMsg.innerHTML = "Error: " + response[1];
			}
			window.scrollTo(0, document.body.scrollHeight);
		}
    };
    handleGenerateImage();
}
