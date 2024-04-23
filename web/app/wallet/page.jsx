import '../../../styles/DashboardWallet.scss';

import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { FaEthereum } from 'react-icons/fa';

const WalletPage = () => {
  return (
    <div className="wallet">
      <div className="wallet__item item-1">
        <img
          src="/assets/artisan-icon.png"
          alt=""
          className="wallet__item__img"
        />
        <div className="wallet__item__details">
          <p className="p-2">THEARTISAN WALLET</p>
          <p className="p-2 dimmed">0x8...BD91EC</p>
        </div>

        <div className="wallet__item__action">
          <span className="p-5">EST. BALANCE</span>
          <span className="h-6">$670</span>
        </div>
      </div>

      {/* item 2 */}
      <div className="wallet__item">
        <RiMoneyDollarCircleFill className="wallet__item__icon" />
        <div className="wallet__item__details">
          <p className="p-4 dimmed">USDC</p>
          <p className="p-2 dimmed">0.00</p>
        </div>

        <div className="wallet__item__action">
          <span className="p-3">DEPOSIT USDC </span>
        </div>
      </div>

      {/* item 3 */}

      <div className="wallet__item">
        <FaEthereum className="wallet__item__icon" />
        <div className="wallet__item__details">
          <p className="p-4 dimmed">ETHEREUM</p>
          <p className="p-2 dimmed">0.00</p>
        </div>

        <div className="wallet__item__action">
          <span className="p-3">DEPOSIT ETH</span>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;