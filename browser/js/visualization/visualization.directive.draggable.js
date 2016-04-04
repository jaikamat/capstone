app.directive('draggable', function () {
  return function (scope, element) {
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function (e) {
        e.dataTransfer.effectAllowed = 'move';

        var drag = document.getElementById('drag');
        drag.load();
        drag.play();

        var clone = this.cloneNode(true);
        clone.id = 'clone';
        clone.style.transform = 'translateX(-500px) rotate(-45deg)';
        document.body.appendChild(clone);
        e.dataTransfer.setDragImage(clone, 30, 30);
        this.style.backgroundColor = 'transparent';
        e.dataTransfer.setData('Text', this.id);
        e.dataTransfer.setData('Parent', this.parentNode.id);
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function (e) {

        var drop = document.getElementById('drop');
        drop.load();
        drop.play();

        this.classList.remove('drag');
        this.style.backgroundColor = this.id.split('-')[0];
        document.getElementById('clone').remove();
        return false;
      },
      false
    );
  };
});

app.directive('droppable', function () {
  return {
    scope: {},
    link: function (scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener(
        'dragover',
        function (e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function (e) {
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function (e) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function (e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();

          this.classList.remove('over');

          var item = document.getElementById(e.dataTransfer.getData('Text'));
          var source = document.getElementById(e.dataTransfer.getData('Parent'));
          if ((item.id.split('-')[1] === 'token' && this.id.split('-')[0] !== 'conditional') || (item.id.split('-')[1] === 'conditional' && this.id.split('-')[0] === 'conditional')) {
            if (this.firstChild) {
              var oldChild = this.removeChild(this.firstChild);
              source.appendChild(oldChild);
            }
            item.style.backgroundColor = item.id.split('-')[0];
            this.appendChild(item);
          }

          return false;
        },
        false
      );

    }
  };
});
