export default {
  icon: "https://stabilityai-stable-diffusion-1.hf.space/favicon.ico",
  name: {
    en: "Stable Diffusion - Gradio",
    vi: "Stable Diffusion - Gradio",
  },
  description: {
    en: "Stable Diffusion Demo on Gradio",
    vi: "Trình tạo ảnh AI sử dụng modal Stable Diffusion",
  },

  onClickExtension: () => {
    let choice = prompt(
      "Enter your choice:\n" +
        "   1: stable diffusion 1\n" +
        "   2: stable diffusion 2.1\n" +
        "   3: stable diffusion - image variations\n",
      "2"
    );

    if (choice == null) return;

    if (choice == "1")
      window.open("https://stabilityai-stable-diffusion-1.hf.space/");
    else if (choice == "2")
      window.open("https://stabilityai-stable-diffusion.hf.space/");
    else if (choice == "3")
      window.open(
        "https://lambdalabs-stable-diffusion-image-variation-54db9c0.hf.space/"
      );
    else alert("Invalid version");
  },
};
