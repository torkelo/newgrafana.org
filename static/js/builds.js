var buildFetcher = function() {

  var dateSortDesc = function (file1, file2) {
    if (file1.date > file2.date) return -1;
    if (file1.date < file2.date) return 1;
    return 0;
  };

  var bucket = new AWS.S3({params: {Bucket: 'grafanarel'}});


  bucket.makeUnauthenticatedRequest('listObjects', {Prefix: 'builds/grafana'}, function (err, data) {
    if (!data || !data.Contents) {
      return;
    }

    var files = $.map(data.Contents, function(item) {
      return {
        key: item.Key,
        date: item.LastModified,
        size: item.Size
      };
    });

    files.sort(dateSortDesc);

    $.each(files, function(index, file) {
      var type;
      if (file.key.indexOf('.rpm') !== -1) {
        type = "Redhat/Centos (64bit) .rpm package";
      } else if (file.key.indexOf('.deb') !== -1)  {
        type = "Ubuntu/Debian (64bit) .deb package";
      } else {
        type = "Linux binary tar";
      }

      var link = '<a href="https://grafanarel.s3.amazonaws.com/' +
                    file.key + '">' + file.key.substring(7) +
                 '</a>';

      var tr = $('<tr></tr>');
      tr.append('<td>' + type + '</td>');
      tr.append('<td>' + link + '</td>');
      tr.append('<td>' + file.date.toLocaleString() + '</td>');

      if (file.key.indexOf('latest') !== -1) {
        $('#ci-latest').append(tr);
      } else {
        $('#ci-builds').append(tr);
      }
    });
  });

}();
