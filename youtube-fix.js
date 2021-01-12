import $ from 'jquery';

/*
  YouTube 初回表示軽量化スクリプト
  Copyright Rectus Inc, 2020/10/14 Ver 0.08
  https://www.rectus.co.jp/
 */

$(function () {
  var srcs = [];
  var images = [];
  var heights = [];
  var widths = [];
  var thumbs = [];
  var imgs = [];

  // 全てのiframeタグに対して処理を実行
  $('iframe.fastyt').each(function (index) {
    var img;
    var maxWidth;

    // 属性を配列に格納
    srcs[index] = $(this).attr('data-src');
    heights[index] = $(this).attr('height');
    widths[index] = $(this).attr('width');
    thumbs[index] = $(this).attr('data-thumbnail');
    imgs[index] = $(this).attr('data-img');
    maxWidth = getAncestorWidth($(this));

    // 取りうる最大幅を超えている場合はそこまでにする．
    if (maxWidth < widths[index]) {
      heights[index] = Math.floor((heights[index] * maxWidth) / widths[index]);
      widths[index] = Math.floor(maxWidth);
    }

    img = 'mqdefault';
    if (imgs[index]) {
      img = imgs[index];
    }

    // URL から動画 id のみを取得して文字連結をしてサムネイルを取得
    var id = srcs[index].match(/[/?=]([a-zA-Z0-9_-]{11})[&?]?/)[1];
    if (thumbs[index]) {
      images[index] = thumbs[index];
    } else {
      // 高精細にしたい場合は data-img="maxresdefault" を指定
      images[index] = '//img.youtube.com/vi/' + id + '/' + img + '.jpg';
    }

    // iframeをサムネイル画像に置換
    $(this)
      .after(
        '<div class="yt"><div class="yt_play"><img src="' +
          images[index] +
          '" class="movie" width="' +
          widths[index] +
          '" height="' +
          heights[index] +
          '"></div></div>'
      )
      .remove();
    $('.yt').eq([index]).css('width', widths[index]);
    $('.yt').eq([index]).css('height', heights[index]);
  });

  $('.yt_play').each(function (index) {
    // サムネイルがクリックされた時の処理
    $(this).click(function () {
      // iframeに置換
      var autoplay;
      if (0 < srcs[index].indexOf('?')) {
        autoplay = '&';
      } else {
        autoplay = '?';
      }
      autoplay += 'autoplay=1';

      $(this).replaceWith(
        '<iframe src="' +
          srcs[index] +
          autoplay +
          '" allow="autoplay" frameborder="0" width="' +
          widths[index] +
          '" height="' +
          heights[index] +
          '" allowfullscreen></iframe>'
      );
    });
  });
});

function getAncestorWidth(element) {
  var width;
  if (element.parent() === undefined) {
    return element.outerWidth(true);
  }
  width = element.parent().outerWidth(true);
  if (width == 0) {
    width = getAncestorWidth(element.parent());
  } else {
    width = element.parent().outerWidth(true);
  }
  return width;
}
