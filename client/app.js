new Vue({
  el: '#puppies',
  data: {
    puppy: {
      name: '',
      owner: '',
      image: '',
      description: ''
    },
    puppies: [],
    styleImage: {
      height: '300px',
      width: '300px'
    }
  },
  created: function() {
    this.fetchPuppies();
  },
  methods: {
    addPuppy: function() {
      var vm = this;
      axios.post('/api/puppies', {
        name: vm.puppy.name,
        owner: vm.puppy.owner,
        image: vm.puppy.image,
        description: vm.puppy.description
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      })
    }, 
    fetchPuppies: function() {
      var vm = this;
      axios.get('/api/puppies')
        .then(function(response) {
          console.log(response.data);
          response.data.forEach(function(puppy) {
            vm.puppies.push(puppy);
          })
        })
        .catch(function(error) {
          console.log(error);
        })
    }
  }
});