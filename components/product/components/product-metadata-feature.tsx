// components/MetadataLinks.tsx
export default function MetadataLinks() {
    return (
      <div className="bg-white rounded-3xl p-5 border-gray mb-5 ">
        <h2 className="text-xl font-bold mb-4">Metadatas</h2>
        <section className="flex md:flex-row flex-col gap-2">
          <button className="border-gray font-normal py-2 text-sm px-4 rounded-full flex items-center gap-2">
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_436_4711)">
                <path
                  d="M4.04741 11.9485C4.16207 11.833 4.31973 11.7656 4.48694 11.7656H19.6506C19.9277 11.7656 20.0663 12.1025 19.8704 12.2998L16.8749 15.3171C16.7603 15.4326 16.6026 15.5 16.4354 15.5H1.2717C0.99461 15.5 0.856064 15.1631 1.05194 14.9658L4.04741 11.9485Z"
                  fill="black"
                  fillOpacity="0.7"
                />
                <path
                  d="M4.04741 0.682868C4.16685 0.567372 4.32451 0.5 4.48694 0.5H19.6506C19.9277 0.5 20.0663 0.836862 19.8704 1.03417L16.8749 4.05149C16.7603 4.16699 16.6026 4.23436 16.4354 4.23436H1.2717C0.99461 4.23436 0.856064 3.8975 1.05194 3.70019L4.04741 0.682868Z"
                  fill="black"
                  fillOpacity="0.7"
                />
                <path
                  d="M16.8749 6.28052C16.7603 6.16503 16.6026 6.09766 16.4354 6.09766H1.2717C0.99461 6.09766 0.856064 6.43452 1.05194 6.63182L4.04741 9.64915C4.16207 9.76464 4.31973 9.83202 4.48694 9.83202H19.6506C19.9277 9.83202 20.0663 9.49515 19.8704 9.29785L16.8749 6.28052Z"
                  fill="black"
                  fillOpacity="0.7"
                />
              </g>
              <defs>
                <clipPath id="clip0_436_4711">
                  <rect
                    width="19"
                    height="15"
                    fill="white"
                    transform="translate(0.960205 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Check on solscan
          </button>
          <button className="border-gray font-normal py-2 text-sm px-4 rounded-full">
            Lorem ipsum
          </button>
          <button className="border-gray font-normal py-2 text-sm px-4 rounded-full">
            Lorem ipsum
          </button>
          <button className="border-gray font-normal py-2 text-sm px-4 rounded-full">
            Lorem ipsum
          </button>
        </section>
      </div>
    );
  }
  