import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    public constructor();
  }

  export default WebpackWorker;
}
