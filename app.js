function previewFile(file){
  const reader  = new FileReader();
  $("#frames_list").append(newFrameImg());
  const img = $("#frames_list img:last");

  reader.onloadend = function() {
    img.attr('src', reader.result)
  }
  reader.readAsDataURL(file);
}

function newFrameImg() {
  return "<div class='frame_container'>" +
    "<img width=200 height=200/>" +
    "<label for='repeat'>How many times should this frame repeat?</label>" +
    "<input type='number' name='repeat' value=1>" +
  "</div>"
}

function numberFromInput(name, options={}) {
  let value = $(`input[name=${name}]`).val();
  if (options.float) {
    return Number.parseFloat(value);
  } else {
    return Number.parseInt(value);
  }
}

function getImagesWithRepetition() {
  let images = [];
  $("#frames_list div").each((_, div) => {
    let repeat = $(div).find("input[name='repeat']").val();
    repeat = Number.parseInt(repeat) || 1;
    let img = $(div).find('img')[0];
    for (var i = 0; i < repeat; i++) {
      images.push(img);
    }
  });
  return images;
}

function createGif(options) {
  gifshot.createGIF({
    images: options.images,
    interval: options.interval,
    width: options.width,
    height: options.height
  }, function(obj) {
    if(!obj.error) {
      let image = obj.image,
      animatedImage = document.createElement('img');
      animatedImage.src = image;
      animatedImage.height = options.height;
      animatedImage.width = options.width;
      $("#result").append(animatedImage);
    }
  });
}

$(() => {
  $("#upload").change((event) => {
    let files = event.target.files;
    _.each(files, function(file) {
      previewFile(file);
    });
  });

  $("#submit").click((event) => {
    let interval = numberFromInput('interval', {float: true}) || 0.1;
    let height = numberFromInput('height') || 200;
    let width = numberFromInput('width') || 200;
    let images = getImagesWithRepetition();
    createGif({images, height, width, interval});
  });
});
