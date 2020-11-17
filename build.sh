rm -r -f *.js *.d.ts *.gz *.br reactive
npx tsc

compress() {
  npx terser --compress  --module --mangle --output $1 $1
}

compress create.js
compress preact.js
compress react.js
compress reactive/merge.js
compress reactive/observable.js
compress reactive/subject.js
compress reactive/subscription.js