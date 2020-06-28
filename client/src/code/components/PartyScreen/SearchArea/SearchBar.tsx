import React from "react";
import "../../../../style.css";

type IProps = {
  onSearchChange: Function;
  clearResults: Function;
};

type IState = {
  searchTerm: string;
  clearButtonVisible: boolean;
};

class SearchBar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      searchTerm: "",
      clearButtonVisible: false,
    };
  }

  onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ searchTerm: e.target.value }, () => {
      if (this.state.searchTerm) {
        this.props.onSearchChange(this.state.searchTerm);
      } else {
        this.props.clearResults();
        this.makeClearHidden();
      }
    });
  }

  handleClearClick(): void {
    this.setState({ searchTerm: "" });
    this.props.clearResults();
    this.makeClearHidden();
  }

  makeClearHidden(): void {
    this.setState({ clearButtonVisible: false });
  }

  makeClearVisible: Function = () => {
    this.setState({ clearButtonVisible: true });
  };

  render() {
    return (
      <div className="flex relative pt-4 py-8 px-2">
        <svg
          className="flex-none fill-current text-xlry-blue w-24 h-24 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 172 172"
        >
          <path d="M74.53333,17.2c-31.59642,0 -57.33333,25.73692 -57.33333,57.33333c0,31.59642 25.73692,57.33333 57.33333,57.33333c13.73998,0 26.35834,-4.87915 36.24766,-12.97839l34.23203,34.23203c1.43802,1.49778 3.5734,2.10113 5.5826,1.57735c2.0092,-0.52378 3.57826,-2.09284 4.10204,-4.10204c0.52378,-2.0092 -0.07957,-4.14458 -1.57735,-5.5826l-34.23203,-34.23203c8.09924,-9.88932 12.97839,-22.50768 12.97839,-36.24766c0,-31.59642 -25.73692,-57.33333 -57.33333,-57.33333zM74.53333,28.66667c25.39937,0 45.86667,20.4673 45.86667,45.86667c0,25.39937 -20.46729,45.86667 -45.86667,45.86667c-25.39937,0 -45.86667,-20.46729 -45.86667,-45.86667c0,-25.39937 20.4673,-45.86667 45.86667,-45.86667z"></path>
        </svg>
        <input
          id="search"
          className="ml-1 text-45xl text-white bg-black border-b-8 border-xlry-blue rounded-sm block mx-auto focus:outline-none w-11/12"
          type="search"
          value={this.state.searchTerm}
          onChange={e => this.onInputChange(e)}
          autoComplete="off"
          onFocus={() => this.makeClearVisible()}
        />
        <div
          onClick={
            () => {
              this.handleClearClick();
            }
            // addTrackToRequests("ant", searchResult);
          }
        >
          <svg
            className={this.state.clearButtonVisible ? "clearVisible" : "clearHidden"}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 172 172"
          >
            <path d="M107.33488,86l46.8872,-70.3308c0.70176,-1.05608 0.77056,-2.41144 0.172,-3.52944c-0.59856,-1.118 -1.76472,-1.81976 -3.03408,-1.81976h-25.2496c-1.12488,0 -2.18096,0.5504 -2.82424,1.47576l-37.28616,53.56424l-37.2896,-53.56424c-0.64328,-0.92536 -1.69592,-1.47576 -2.8208,-1.47576h-25.2496c-1.26936,0 -2.43552,0.69832 -3.03408,1.81632c-0.59856,1.118 -0.52976,2.4768 0.172,3.52944l46.8872,70.33424l-46.8872,70.3308c-0.70176,1.05608 -0.77056,2.41144 -0.172,3.52944c0.59856,1.118 1.76472,1.81976 3.03408,1.81976h25.2496c1.12488,0 2.18096,-0.5504 2.82424,-1.47576l37.28616,-53.56424l37.2896,53.56424c0.64328,0.92536 1.69592,1.47576 2.8208,1.47576h25.2496c1.26936,0 2.43552,-0.69832 3.03408,-1.81632c0.59856,-1.118 0.52976,-2.4768 -0.172,-3.52944z"></path>
          </svg>
        </div>
      </div>
    );
  }
}

export default SearchBar;
