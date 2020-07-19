import React, { useState } from "react";
import "../../../../style.css";
// import { Worker as SpotifyWorker } from "../../../Spotify";

// on focus: put a grey layer between search area and everything else, and show clear button, and switch search
// icon into a back arrow.
// back arrow: gets us back to party screen, (clearing searchbar and unfocusing) switches back into icon
// when pressed
// clear button: clears current input. disappears when input value is empty.

type IProps = {
  onSearchChange: Function;
  clearResults: Function;
  maskSearchArea: Function;
  unmaskSearchArea: Function;
};

type IState = {
  searchTerm: string;
  clearButtonVisible: boolean;
  showBackArrow: boolean;
};

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [clearButtonVisible, setClearButtonVisible] = useState(false);
//   return (
//     <div className="flex relative pt-4 py-8 px-2">
//       <svg
//         className="flex-none fill-current text-xlry-blue w-24 h-24 mr-1"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 172 172"
//       >
//         <path d="M74.53333,17.2c-31.59642,0 -57.33333,25.73692 -57.33333,57.33333c0,31.59642 25.73692,57.33333 57.33333,57.33333c13.73998,0 26.35834,-4.87915 36.24766,-12.97839l34.23203,34.23203c1.43802,1.49778 3.5734,2.10113 5.5826,1.57735c2.0092,-0.52378 3.57826,-2.09284 4.10204,-4.10204c0.52378,-2.0092 -0.07957,-4.14458 -1.57735,-5.5826l-34.23203,-34.23203c8.09924,-9.88932 12.97839,-22.50768 12.97839,-36.24766c0,-31.59642 -25.73692,-57.33333 -57.33333,-57.33333zM74.53333,28.66667c25.39937,0 45.86667,20.4673 45.86667,45.86667c0,25.39937 -20.46729,45.86667 -45.86667,45.86667c-25.39937,0 -45.86667,-20.46729 -45.86667,-45.86667c0,-25.39937 20.4673,-45.86667 45.86667,-45.86667z"></path>
//       </svg>
//       <input
//         id="search"
//         className="ml-1 text-45xl text-white bg-transparent border-b-8 border-xlry-blue rounded-sm block mx-auto focus:outline-none w-11/12"
//         type="search"
//         value={searchTerm}
//         onChange={e => {
//           setSearchTerm(e.target.value);
//           if (searchTerm) {
//             // this.props.onSearchChange(this.state.searchTerm);
//           } else {
//             // this.props.clearResults();
//             setClearButtonVisible(false);
//           }
//         }}
//         autoComplete="off"
//         onFocus={() => setClearButtonVisible(true)}
//       />
//       <div
//         onClick={
//           () => {
//             setClearButtonVisible(false);
//           }
//           // addTrackToRequests("ant", searchResult);
//         }
//       >
//         <svg
//           className={clearButtonVisible ? "clearVisible" : "clearHidden"}
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 172 172"
//         >
//           <path d="M107.33488,86l46.8872,-70.3308c0.70176,-1.05608 0.77056,-2.41144 0.172,-3.52944c-0.59856,-1.118 -1.76472,-1.81976 -3.03408,-1.81976h-25.2496c-1.12488,0 -2.18096,0.5504 -2.82424,1.47576l-37.28616,53.56424l-37.2896,-53.56424c-0.64328,-0.92536 -1.69592,-1.47576 -2.8208,-1.47576h-25.2496c-1.26936,0 -2.43552,0.69832 -3.03408,1.81632c-0.59856,1.118 -0.52976,2.4768 0.172,3.52944l46.8872,70.33424l-46.8872,70.3308c-0.70176,1.05608 -0.77056,2.41144 -0.172,3.52944c0.59856,1.118 1.76472,1.81976 3.03408,1.81976h25.2496c1.12488,0 2.18096,-0.5504 2.82424,-1.47576l37.28616,-53.56424l37.2896,53.56424c0.64328,0.92536 1.69592,1.47576 2.8208,1.47576h25.2496c1.26936,0 2.43552,-0.69832 3.03408,-1.81632c0.59856,-1.118 0.52976,-2.4768 -0.172,-3.52944z"></path>
//         </svg>
//       </div>
//     </div>
//   );
// };

class SearchBar extends React.Component<IProps, IState> {
  textInput = React.createRef<HTMLInputElement>();

  constructor(props: IProps) {
    super(props);
    this.state = {
      searchTerm: "",
      clearButtonVisible: false,
      showBackArrow: false,
    };
  }

  onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ searchTerm: e.target.value }, () => {
      if (this.state.searchTerm) {
        this.props.onSearchChange(this.state.searchTerm);
      } else {
        this.props.clearResults();
      }
    });
  }

  handleClearClick(): void {
    this.setState({ searchTerm: "" }, () => {
      this.props.clearResults();
      this.makeClearHidden();
      if (this.textInput.current) this.textInput.current.focus();
    });
  }

  makeClearHidden(): void {
    this.setState({ clearButtonVisible: false });
  }

  handleFocus: Function = () => {
    this.props.maskSearchArea();
    this.setState({ clearButtonVisible: true, showBackArrow: true });
  };

  handleBackClick: Function = () => {
    this.props.unmaskSearchArea();
    this.props.clearResults();
    this.makeClearHidden();
    this.setState({ searchTerm: "", showBackArrow: false });
  };

  render() {
    return (
      <div className="flex relative rounded-full bg-white bg-opacity-25 mt-10 ml-8 py-2 pl-3 pr-32 font-nunito">
        {this.state.showBackArrow ? (
          <svg
            className="flex-none fill-current text-xlry-blue w-24 h-24 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-5 -5 40 40"
            onClick={() => {
              this.handleBackClick();
            }}
          >
            <path d="M28,14H8.8l4.62-4.62C13.814,8.986,14,8.516,14,8c0-0.984-0.813-2-2-2c-0.531,0-0.994,0.193-1.38,0.58l-7.958,7.958  C2.334,14.866,2,15.271,2,16s0.279,1.08,0.646,1.447l7.974,7.973C11.006,25.807,11.469,26,12,26c1.188,0,2-1.016,2-2  c0-0.516-0.186-0.986-0.58-1.38L8.8,18H28c1.104,0,2-0.896,2-2S29.104,14,28,14z"></path>
          </svg>
        ) : (
          <svg
            className="flex-none fill-current text-xlry-blue w-24 h-24 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-10 -16 200 200"
            onClick={() => {
              if (this.textInput.current) this.textInput.current.focus();
            }}
          >
            <path d="M74.53333,17.2c-31.59642,0 -57.33333,25.73692 -57.33333,57.33333c0,31.59642 25.73692,57.33333 57.33333,57.33333c13.73998,0 26.35834,-4.87915 36.24766,-12.97839l34.23203,34.23203c1.43802,1.49778 3.5734,2.10113 5.5826,1.57735c2.0092,-0.52378 3.57826,-2.09284 4.10204,-4.10204c0.52378,-2.0092 -0.07957,-4.14458 -1.57735,-5.5826l-34.23203,-34.23203c8.09924,-9.88932 12.97839,-22.50768 12.97839,-36.24766c0,-31.59642 -25.73692,-57.33333 -57.33333,-57.33333zM74.53333,28.66667c25.39937,0 45.86667,20.4673 45.86667,45.86667c0,25.39937 -20.46729,45.86667 -45.86667,45.86667c-25.39937,0 -45.86667,-20.46729 -45.86667,-45.86667c0,-25.39937 20.4673,-45.86667 45.86667,-45.86667z"></path>
          </svg>
        )}
        <input
          id="search"
          className="ml-1 text-5xl text-white bg-transparent block mx-auto focus:outline-none w-11/12"
          type="text"
          value={this.state.searchTerm}
          autoComplete="off"
          onChange={e => this.onInputChange(e)}
          onFocus={() => this.handleFocus()}
          ref={this.textInput}
          onBlur={() => {
            if (!this.state.searchTerm) {
              this.setState({ showBackArrow: false, clearButtonVisible: false });
              this.props.unmaskSearchArea();
            }
          }}
        />
        <svg
          onClick={
            () => {
              this.handleClearClick();
            }
            // addTrackToRequests("ant", searchResult);
          }
          className={`${this.state.clearButtonVisible ? `clearVisible` : `clearHidden`}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 3300 2100"
        >
          <path d="M29 172c-39-39-39-103 0-142s103-39 142 0l1099 1099L2369 30c39-39 103-39 142 0s39 103 0 142L1412 1271l1099 1099c39 39 39 103 0 142s-103 39-142 0L1270 1413 171 2512c-39 39-103 39-142 0s-39-103 0-142l1099-1099L29 172z"></path>
        </svg>
      </div>
    );
  }
}

export default SearchBar;
