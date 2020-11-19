rm -r -f *.js *.d.ts *.gz *.br preact react reactive rxjs
npx tsc

compress() {
  npx terser --compress  --module --mangle --output $1 $1
}

# compress reactive/create.js
# compress reactive/ignore.js
# compress reactive/observe-object.js
# compress reactive/observe.js
# compress reactive/patch-constructor.js
# compress reactive/proxy-handler.js

# compress react/index.js
# compress preact/index.js

# compress rxjs/subject.js
# compress rxjs/operators/filter.js
# compress rxjs/operators/map.js
# compress rxjs/operators/pipe.js
