import React from 'react';
import Form from '../ui/components/_common/Form';
import Input from '../ui/components/_common/Input';
import Button from '../ui/components/_common/Button';
import Header from '../ui/components/_common/Header';

const userSignUp = () => {
  const username = document.querySelector('[name="username"]').value;
  const email = document.querySelector('[name="email"]').value;
  const password = document.querySelector('[name="password"]').value;
  const passwordConf = document.querySelector('[name="passwordConf"]').value;
  fetch('/api/sign-up', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify({
      username,
      email,
      password,
      passwordConf,
    }), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .catch(error => console.log(error.reason))
    .then(response => console.log(response));
};

const userLogin = () => {
  const email = document.querySelector('[name="emailLogIn"]').value;
  const password = document.querySelector('[name="passwordLogIn"]').value;
  fetch('/api/log-in', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify({
      email,
      password,
    }), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .catch(error => console.log(error))
    .then(response => console.log(response));
};

const Login = () => (
  <div className="Login">
    <Form id="sign-up" onSubmit={() => userSignUp()}>
      <Header
        heading="Sign up"
      />
      <Input
        label="Email"
        name="email"
        type="text"
      />
      <Input
        label="Username"
        name="username"
        type="text"
      />
      <Input
        label="Password"
        name="password"
        type="password"
      />
      <Input
        label="Password confirm"
        name="passwordConf"
        type="password"
      />
      <Button
        label="Sign up"
        type="submit"
      />
    </Form>
    <Form id="sign-up" onSubmit={() => userLogin()}>
      <Header
        heading="Log in"
      />
      <Input
        label="Email"
        name="emailLogIn"
        type="text"
      />
      <Input
        label="Password"
        name="passwordLogIn"
        type="password"
      />
      <Button
        label="Sign up"
        type="submit"
      />
    </Form>
  </div>
);

Login.propTypes = {

};

Login.defaultProps = {

};

export default Login;
