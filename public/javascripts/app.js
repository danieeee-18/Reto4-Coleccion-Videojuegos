console.log("App.js cargado");

// Lógica del Dialog (Modal)
const infoBtn = document.querySelector("#infoBtn");
const dialog = document.querySelector("#infoDialog");
const closeBtn = document.querySelector("#closeDialog");

if(infoBtn && dialog && closeBtn){
    infoBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
        dialog.close();
    });

    // Cerrar al hacer click fuera
    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
}