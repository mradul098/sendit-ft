const dropZone = document.querySelector('.drop-zone');
const browseBtn = document.querySelector('.browseBtn');
const fileInput = document.querySelector('#fileInput');

const host = "https://inshare.herokuapp.com/";
const uploadURL= `${host}api/files`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb


dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
      console.log("dropped", e.dataTransfer.files[0].name);
    const files = e.dataTransfer.files;
    if (files.length === 1) {
      if (files[0].size < maxAllowedSize) {
        fileInput.files = files;            //files attribute gives a A FileList listing the chosen files there are many other attributes of the input like create accept etc.
        uploadFile();
      } else {
        showToast("Max file size is 100MB");
      }
    } else if (files.length > 1) {
      showToast("You can't upload multiple files");
    }
    dropZone.classList.remove("dragged");
});

  
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragged");

    // console.log("dropping file");
});

const uploadFile = ()=>{
    const file = fileInput.files[0];
    const formData = new FormData();    //The FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method
    formData.append("myfile",file); //ek argument name pass karna padta hai whihc we passed myfile in this case though currently no use

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange=()=>{
        console.log(xhr.readyState);
    };

    xhr.open("POST",uploadURL);
    xhr.send(formData);
};