/* eslint-disable no-unused-vars */
import React from "react";
 
const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;
 
    return (
        <div
            
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div>
                {children}
            </div>
        </div>
    );
};
 
export default Modal;