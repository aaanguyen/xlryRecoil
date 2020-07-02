import React, { Component } from "react";

type IProps = {
  role: string;
  pid: string;
  createParty: Function;
  joinParty: Function;
  fromServerScreennameErrorMessage: string;
  fromServerPartyErrorMessage: string;
};

type IState = {
  partyName: string;
  screenname: string;
  showPartyError: boolean;
  showScreennameError: boolean;
  partyErrorMessage: string;
  screennameErrorMessage: string;
};

export default class Form extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      partyName: "",
      screenname: "",
      showPartyError: false,
      showScreennameError: false,
      partyErrorMessage: "",
      screennameErrorMessage: "",
    };
  }

  invalidErrorMessage: string = "Invalid name. 4-12 characters, letters/numbers only.";

  handlePartyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ partyName: e.target.value });
  };

  handleScreennameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ screenname: e.target.value });
  };

  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = /^[a-zA-Z-]+(\s{0,1}[a-zA-Z-])*$/;
    console.log(this.state.partyName);
    const partyNameOK: RegExpMatchArray | null = this.state.partyName.match(validation);
    const screennameOK: RegExpMatchArray | null = this.state.screenname.match(validation);
    console.log(partyNameOK);
    console.log(screennameOK);
    if (partyNameOK && screennameOK) {
      this.setState({
        showPartyError: false,
        showScreennameError: false,
        partyErrorMessage: "",
        screennameErrorMessage: "",
      });
      if (this.props.role === "host") {
        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString);
        const tokenCode = urlParams.get("code");
        console.log(tokenCode);
        this.props.createParty(this.state.partyName, this.state.screenname, this.props.pid, tokenCode);
      } else if (this.props.role === "guest") {
        this.props.joinParty(this.state.partyName, this.state.screenname, this.props.pid);
      }
    } else {
      console.log("yo we went in here");
      this.setState({
        showPartyError: partyNameOK ? false : true,
        showScreennameError: screennameOK ? false : true,
        screennameErrorMessage: this.invalidErrorMessage,
      });
    }
  };

  render() {
    return (
      <div className="bg-black">
        <form onSubmit={e => this.onSubmit(e)}>
          <div className="h-64"></div>
          <input
            type="text"
            placeholder="Party Name"
            autoCapitalize="none"
            autoFocus
            value={this.state.partyName}
            onChange={this.handlePartyNameChange}
            className="mx-auto text-45xl text-white bg-black border-b-8 border-xlry-blue rounded-sm block mx-auto focus:outline-none w-11/12"
          />
          {!this.state.showPartyError && (
            <p className="text-white text-3xl text-center">{this.props.fromServerPartyErrorMessage}</p>
          )}
          {this.state.showPartyError && (
            <p className="text-white text-3xl text-center">{this.invalidErrorMessage}</p>
          )}
          <div className="h-12"></div>
          <input
            type="text"
            placeholder="Screenname"
            autoCapitalize="none"
            value={this.state.screenname}
            onChange={this.handleScreennameChange}
            className="px-auto text-45xl text-white bg-black border-b-8 border-xlry-blue rounded-sm block mx-auto focus:outline-none w-11/12"
          />
          {!this.state.showScreennameError && (
            <p className="text-white text-3xl text-center">{this.props.fromServerScreennameErrorMessage}</p>
          )}
          {this.state.showScreennameError && (
            <p className="text-white text-3xl text-center">{this.invalidErrorMessage}</p>
          )}
          <div className="h-24"></div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-xlry-blue text-white font-extrabold text-4xl w-11/12 py-8 rounded-lg"
            >
              {`${this.props.role === "host" ? "HOST" : "JOIN"} PARTY`}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
