import '@/styles/Loading.scss';
import { Spin } from "antd";

export function Loading() {
  return (
    <div className="loading">
        <div className="loading-text">
            <span className="loading-text-words">L</span>
            <span className="loading-text-words">O</span>
            <span className="loading-text-words">A</span>
            <span className="loading-text-words">D</span>
            <span className="loading-text-words">I</span>
            <span className="loading-text-words">N</span>
            <span className="loading-text-words">G</span>
        </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <Spin />
  )
}