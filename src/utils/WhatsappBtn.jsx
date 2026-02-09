import { FaWhatsapp } from "react-icons/fa";

function WhatsappBtn() {
  const phoneNumber = "919136036603";
  const message = "Hello, I’m interested in your Office Interior services";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="z-50 fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full scale-75 hover:scale-100 transition duration-300 ease-in-out shadow-lg hover:bg-green-600"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}

export default WhatsappBtn;
