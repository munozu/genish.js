'use strict'

let gen = require('./gen.js')

let proto = {
  basename: 'param',

  gen() {
    gen.requestMemory( this.memory )
    
    gen.params.add( this )

    const isWorklet = gen.mode === 'worklet'

    if( isWorklet ) gen.parameters.add( this.name )

    this.value = this.initialValue

    gen.memo[ this.name ] = isWorklet ? this.name : `memory[${this.memory.value.idx}]`

    return gen.memo[ this.name ]
  } 
}

module.exports = ( propName=0, value=0, min=0, max=1 ) => {
  let ugen = Object.create( proto )
  
  if( typeof propName !== 'string' ) {
    ugen.name = ugen.basename + gen.getUID()
    ugen.initialValue = propName
  }else{
    ugen.name = propName
    ugen.initialValue = value
  }

  ugen.min = min
  ugen.max = max

  Object.defineProperty( ugen, 'value', {
    get() {
      if( this.memory.value.idx !== null ) {
        return gen.memory.heap[ this.memory.value.idx ]
      }
    },
    set( v ) {
      if( this.memory.value.idx !== null ) {
        gen.memory.heap[ this.memory.value.idx ] = v 
      }
    }
  })

  ugen.memory = {
    value: { length:1, idx:null }
  }

  return ugen
}
