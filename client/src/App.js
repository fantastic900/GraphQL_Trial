import React, { Component } from 'react';
import {ApolloClient, gql, HttpLink, InMemoryCache} from 'apollo-boost'

const endPointUrl = 'http://localhost:9000/graphql'
const client = new ApolloClient({
   link: new HttpLink({uri:endPointUrl}),
   cache: new InMemoryCache()
})

async function loadGreeting() {
  const response = await fetch('http://localhost:9000/graphql', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({query: '{greeting}'})
  })
  const responseBody = await response.json()
  return responseBody.data.greeting
}

async function loadSayHello(name) {
  const response = await fetch('http://localhost:9000/graphql', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({query:`{sayHello(name:"${name}")}`})
  })
  const responseBody = await response.json()
  return responseBody.data.sayHello
}

async function loadStudents() {
   const query = gql`
   {
      students {
         id
         firstName
         lastName
         college {
            name
         }
      }
   }
   `
   const { data } = await client.query({query})
   return data.students
}

class App extends Component {
  constructor(props) {
     super(props);
     this.state =  {greetingMessage:'',sayHelloMessage:'',userName:'', students: []}
     this.studentTemplate = [];
     this.updateName =  this.updateName.bind(this);
     this.showSayHelloMessage =  this.showSayHelloMessage.bind(this);
     this.showGreeting =  this.showGreeting.bind(this);
  }
  
  showGreeting() {
     loadGreeting().then(g => this.setState({greetingMessage:g+" :-)"}))
  }
  
  showSayHelloMessage() {
     const name = this.state.userName;
     console.log(name)
     loadSayHello(name).then(m => {
      this.setState({sayHelloMessage:m})
    })
  }

  async showStudents() {
   const studentData = await loadStudents();
   this.setState({
      students: studentData
   })
  }
  
  updateName(event) {
     this.setState({userName:event.target.value})
  }
  render() {
     return (
        <div className = "App">
           <header className = "App-header">
              <h1 className = "App-title">Welcome to React</h1>
           </header>
           <br/><br/>
           <section>
              <button id = "btnGreet" onClick = {this.showGreeting}>Greet</button>
              <br/> <br/>
              <div id = "greetingDiv">
                 <h1>{this.state.greetingMessage}</h1>
              </div>
           </section>
           
           <hr/>
           
           <section>
              Enter a name:<input id = "txtName" type = "text" onChange = {this.updateName}
              value = {this.state.userName}/>
              <button id = "btnSayhello" onClick = {this.showSayHelloMessage}>SayHello</button>
              <br/>
              user name is:{this.state.userName}    <br/>
              <div id = "SayhelloDiv">
                 <h1>{this.state.sayHelloMessage}</h1>
              </div>
           </section>
           <div>
               <input type = "button"  value = "loadStudents" onClick = {this.showStudents.bind(this)}/>
               <div>
                  <br/>
                  <hr/>
                  <table border = "3">
                     <thead>
                        <tr>
                           <td>First Name</td>
                           <td>Last Name</td>
                           <td>college Name</td>
                        </tr>
                     </thead>
                     
                     <tbody>
                        {
                           this.state.students.map(s => {
                              return (
                                 <tr key = {s.id}>
                                    <td>
                                       {s.firstName}
                                    </td>
                                    <td>
                                       {s.lastName}
                                    </td>
                                    <td>
                                       {s.college.name}
                                    </td>
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table>
               </div>
            </div>
        </div>
     );
  }
}

export default App;
