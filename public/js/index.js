const dropZone = document.querySelector('.drop-zone');
// const browseBtn = document.querySelector('.browseBtn');
const fileInput = document.querySelector('#fileInput');
const fileURL = document.querySelector("#fileURL");
const browseBtn = document.querySelector('#browseBtn');
const sendbtn = document.querySelector('.send-btn-container');
const copylink = document.querySelector('#copyURLBtn');

const uploadURL= `https://sendit-eft.herokuapp.com/api/files`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb

copylink.addEventListener('click',()=>{
  fileURL.select();
  document.execCommand("copy");

});

sendbtn.addEventListener("click",()=>{
  fetch("http://localhost:3000/api/files/send", {
      
    // Adding method type
    method: "POST",
      
    // Adding body or contents to send
    body: JSON.stringify({
        uuid:(fileURL.value).split("/").splice(-1,1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailForm:emailForm.elements["from-email"].value
    }),
      
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
});

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

browseBtn.addEventListener("click", ()=>{
  fileInput.click();
});

fileInput.addEventListener("change",()=>{
    const file=fileInput.files[0];
    console.log(file);
    uploadFile();
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
        // console.log(xhr.readyState);
        if(xhr.readyState === XMLHttpRequest.DONE)
        {
          var obj = JSON.parse( xhr.response ); //the response link was in json format so we are parsing it so that it can be used like a nomral obj
          console.log(obj.file);
          fileURL.value=obj.file;
        }
    };

    xhr.open("POST",uploadURL);
    xhr.send(formData);
};

