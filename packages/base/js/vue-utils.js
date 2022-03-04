window.generateUUID = function (placeholder) {
  return placeholder
    ? (placeholder ^ Math.random() * 16 >> placeholder / 4).toString(16)
    : ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, window.generateUUID);
};

Vue.component('c5-page-selector', {
  template: '<div><input type="hidden" :name="inputName"></div>',
  props: ['value', 'inputName'],
  mounted: function () {
    var $el = $(this.$el);

    // https://www.concrete5.org/community/forums/customizing_c5/page-selector-5.7
    var self = this;
    Concrete.event.bind('ConcreteSitemap', function(e, instance) {
      Concrete.event.bind('SitemapSelectPage', function(e, data) {
        if (data.instance === instance) {
          Concrete.event.unbind(e);
          // self.$emit('input', data.cID);
        }
      });
    });

    Concrete.event.bind('SitemapPageClear', function () {
      self.$emit('input', 0);
    });

    $el.concretePageSelector({
      inputName: self.inputName,
      cID: self.value,
    });
  },
});

Vue.component('c5-file-selector', {
  template: '<div class="ccm-file-selector"></div>',
  props: ['value', 'inputName'],
  mounted: function () {
    var $el = $(this.$el);
    var self = this;

    Concrete.event.bind('FileManagerBeforeSelectFile', function (e, data) {
      self.$emit('input', data.fID);
    });

    Concrete.event.bind('FileManagerClearFile', function (e, data) {
      self.$emit('input', null);
    });

    $el.concreteFileSelector({
      inputName: self.inputName,
      fID: self.value,
    });
  },
});

Vue.component('c5-image-selector', {
  template: '<div class="ccm-pick-slide-image" @click.prevent="openFileManager">' +
      '<div v-if="imageUrl && imageUrl.length > 0">' +
        '<div v-html="imageUrl"></div>' +
      '</div>' +
      '<div v-else>' +
        '<i class="fa fa-picture-o"></i>' +
      '</div>' +
    '</div>',
  props: ['value'],
  data: function () {
    return {
      imageUrl: '',
    }
  },
  mounted: function () {
    if (this.value) {
      var self = this;
      ConcreteFileManager.getFileDetails(this.value, function (r) {
        var file = r.files[0];
        self.imageUrl = file.resultsThumbnailImg;
      });
    }
  },
  methods: {
    openFileManager: function () {
      var self = this;
      ConcreteFileManager.launchDialog(function(data) {
        ConcreteFileManager.getFileDetails(data.fID, function(r) {
          var file = r.files[0];
          self.imageUrl = file.resultsThumbnailImg;
          self.$emit('input', file.fID);
        });
      });
    },
  },
});
