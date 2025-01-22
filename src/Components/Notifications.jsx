import toast from "react-hot-toast";

export const customToast = (message) =>
    toast(
        message,
        {
            style: {
                border: "1px solid #0C359E",
                padding: "10px",
                color: "#0C359E",
                // width: 'fit-content'
            },
        }
    );