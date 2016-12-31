(function(){

    var $ = function(id) {
        return id ? document.getElementById(id) : null;
    };

    // global
    var currentThreshold = 128,
        scale = 0.25,
        currentImage = '';

    var thresholdLevel = $('threshold-level'),
        thresholdVal = document.querySelector('.threshold-val'),
        add = $('add'),
        subtract = $('subtract'),
        scaleRatio = $('scale'),
        isThresholdOn = $('threshold-on'),
        uploadBtn = $('img-upload'),
        downloadBtn = $('download');

    /**
     * [thresholdConvert 阈值处理]
     * @param  {[type]} ctx       [description]
     * @param  {[type]} imageData [description]
     * @param  {[type]} threshold [阈值]
     * @return {[type]}           [description]
     */
    var thresholdConvert = function(ctx, imageData, threshold) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            // 灰度计算公式
            var gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 *data[i + 2];
            var color = gray >= threshold ? 255 : 0;
            var alpha = data[i + 3];
            data[i]     = color;  // red
            data[i + 1] = color;  // green
            data[i + 2] = color;  // blue
            data[i + 3] = alpha >= threshold ? 255 : 0;  // 去掉透明
        }
        ctx.putImageData(imageData, 0, 0);
    };

    var render = function() {

        if (!currentImage) {
            alert('请先上传图片');
            return;
        }

        var canvasTemp = document.createElement('canvas');
        var context = canvasTemp.getContext('2d');

        var image = new Image();
        image.src = currentImage;
        image.onload = function() {
            canvasTemp.width = image.width * scale;
            canvasTemp.height = image.height * scale;
            // 缩小到 25%
            context.drawImage(image, 0, 0, image.width * scale, image.height * scale);

            var imageData = context.getImageData(0, 0, image.width * scale, image.height * scale);
            // 阈值处理
            isThresholdOn.checked && thresholdConvert(context, imageData, currentThreshold);

            var dataURL = canvasTemp.toDataURL();
            var canvas = $('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.src = dataURL;
            img.onload = function() {
                canvas.width = img.width / scale;
                canvas.height = img.height / scale;

                // 反锯齿
                ctx.imageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;

                ctx.drawImage(img, 0, 0, img.width / scale, img.height / scale);

                download();
            };
        };
    };

    var toggleThreshold = function(checked) {
        var thresholdRange = $('threshold-range');
        if (checked) {
            thresholdLevel.disabled = false;
            add.disabled = false;
            subtract.disabled = false;
            thresholdRange.classList.remove('disable');
        } else {
            thresholdLevel.disabled = true;
            add.disabled = true;
            subtract.disabled = true;
            thresholdRange.classList.add('disable');
        }
    };


    var download = function() {
        downloadBtn.download = 'pixel.png';
        downloadBtn.href = canvas.toDataURL();
    };



    // events
    thresholdLevel.addEventListener('change', function() {
        currentThreshold = this.value;
        thresholdVal.innerHTML = currentThreshold;
        render();
    }, false);

    subtract.addEventListener('click', function() {
        currentThreshold = --thresholdLevel.value;
        thresholdVal.innerHTML = currentThreshold;
        render();
    }, false);

    add.addEventListener('click', function() {
        currentThreshold = ++thresholdLevel.value;
        thresholdVal.innerHTML = currentThreshold;
        render();
    }, false);

    scaleRatio.addEventListener('change', function() {
        scale = this.value;
        render();
    }, false);

    isThresholdOn.addEventListener('change', function() {
        toggleThreshold(this.checked);
        render();
    }, false);



    // upload
    uploadBtn.addEventListener('change', function(e) {

        var file = e.target.files[0];

        if (!file.type.match('image.*')) {
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(arg) {
            currentImage = arg.target.result;
            var img = '<img class="preview" src="' + arg.target.result + '" alt="preview" >';
            $('img-preview').innerHTML = img;

            render();
        };
    }, false);

})();






