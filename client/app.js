Vue.component('nav-bar', {
  template: `
    <nav class="navbar navbar-default :style="{backgroundColor: 'white', border: 'none'}"">
      <div class="container-fluid">
        <p class="navbar-brand">Vue Puppies</p>
        <a class="navbar-brand" href="index.html">Lend</a>
        <a class="navbar-brand" href="borrow.html">Borrow</a>
      </div>
    </nav>
  `
})

Vue.component('form-add', {
  props: ['puppy'],
  template: `
    <div class="panel-body">
      <div class="form-group">
        <input class="form-control" placeholder="Puppy's Name" v-model="puppy.name">
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Puppy's Owner" v-model="puppy.owner"></textarea>
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Puppy's Image url" v-model="puppy.image"></textarea>
      </div>
      <div class="form-group">
        <textarea class="form-control" placeholder="Description" v-model="puppy.description"></textarea>
      </div>
      <button class="btn btn-primary" v-on:click="addPuppy">Submit</button>
    </div>
  `,
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
        vm.puppy.name = '';
        vm.puppy.owner = '';
        vm.puppy.image = '';
        vm.puppy.description = '';
      })
      .catch(function(error) {
        console.log(error);
      })
    }, 
  }
})

Vue.component('info-card', {
  props: ['puppy'],
  template: `
    <div class="row" :style="{marginTop: '25px', marginBottom: '25px', textAlign:'center', boxShadow: '0 2px 10px 0 rgba(88, 88, 88, 0.3)'}">
      <div class="col-md-4" :style="{marginTop: '10px'}">
        <h4>
          {{ puppy.name }}
        </h4>
        <img :src="puppy.image" :style="styleImage">
      </div>

      <div class="col-md-8" :style="{marginTop: '50px'}">
        <h5>
          {{ puppy.owner }}
        </h5>
        <p>{{ puppy.description }}</p>
      </div>
    </div>
  `, 
  data: function() {
    return {
      styleImage: {
        height: '300px',
        width: '300px',
        marginBottom: '30px'
      }
    }
  }
})

new Vue({
  el: '#lend',
  data: {
    puppy: {
      name: '',
      owner: '',
      image: '',
      description: ''
    },
    puppies: []
  },
  created: function() {
    this.fetchPuppies();
  },
  methods: {
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












