
let chirpButton = $("#chirpButton");

let deleteChirp = (id) => {
  $.ajax({
    url: `/api/chirps/${id}`,
    type: "DELETE",
    success: function () {
      $("#timeline").empty();
      fetchChirps();
    },
  });
};

let editChirp = (id, user, text) => {
  let chirp = {
    user: user,
    text: text,
  };
  $.ajax({
    url: `/api/chirps/${id}`,
    type: "PUT",
    data: JSON.stringify(chirp),
    headers: { "content-type": "application/json" },
    success: function () {
      $("#timeLine").empty();
      location.reload();
      fetchChirps();
    },
  });
};

let fetchChirps = () => {
  $.get("/api/chirps", (data, status) => {
    delete data.nextid;
    let chirpArr = Object.keys(data).map((chirpID) => {
      let chirp = data[chirpID];
      chirp.id = chirpID;
      return chirp;
    });

    chirpArr.forEach((chirp) => {
      let chirpDiv = `
      <div class="row justify-content-center">
        <div class="card w-75 text-center d-flex m-3 shadow justify-content-center border border-info rounded">
         <div class="card-body justify-content-center">
          <h5 class="card-title text-center">${chirp.user}</h5>
          <p class="card-text">${chirp.text}</p>
          <button data-id=${chirp.id} id="deleteChirpButton" class="btn btn-danger" onclick="deleteChirp(${chirp.id})">Delete</button>
          <button data-id=${chirp.id} id="editChirpButton" class="btn btn-danger" data-toggle="modal" data-target="#editModal${chirp.id}">Edit</button>
         </div>
        </div>
        </div>
        <div class="modal fade" id="editModal${chirp.id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Edit Chirp</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <textarea class="modal-body form-control" id="textEdit${chirp.id}">
          ${chirp.text}
          </textarea>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="editChirp(${chirp.id}, '${chirp.user}', $('#textEdit${chirp.id}').val())" data-dismiss="modal">Submit Edit</button>
          </div>
        </div>
      </div>
    </div>
    `;
      $("#timeline").append(chirpDiv);
    });
  });
};

chirpButton.click(() => {
  location.reload();
  let chirpText = $("#chirpText").val();
  let userName = $("#userText").val();
  let chirp = {
    user: userName,
    text: chirpText,
  };
  $.post(`/api/chirps/`, chirp).then(() => {
   
    $("#timeline").empty;
    fetchChirps();
  });
});



fetchChirps();

